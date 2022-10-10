import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent, compose } from "@wordpress/compose";
import { Fragment, useState } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import { useEntityProp } from "@wordpress/core-data";
import {
  PanelBody,
  TextControl,
  SelectControl,
  withFilters,
} from "@wordpress/components";

import * as React from "react";
import { MediaByline } from "../model";

declare const ajaxurl: any;
declare const webpress_users: any;

interface MediaCreditManagerSubscriber {
  valueDidChange(newByline: MediaByline);
}
/**
 * Singleton class used to load/store/cache media credit for an image
 * All loading/saving should happen through the shared singleton to maintain state
 *
 * e.g.
 *
 * MediaCreditManager.shared.load(attachementId)
 */
class MediaCreditManager {
  static readonly shared = new MediaCreditManager();

  private cache = new Map<string, Promise<MediaByline>>();
  private urlMap = new Map<string, Promise<MediaByline>>();
  private saveOperations = new Map<string, Object>();

  private timer;

  protected constructor() {}

  saveDebounced = this.debounce(() => this.saveAll(), 500);

  async subscribe(
    attachmentId: string,
    subscriber: MediaCreditManagerSubscriber
  ) {
    let figures = document.querySelectorAll("figure.wp-block-image");

    figures.forEach(async (figure) => {
      let imgTag = figure.querySelector("img");
      if (!imgTag) {
        return;
      }
      let bylineTag = this.installByline(figure);
      let credit = await this.creditForUrl(imgTag.src);
      if (credit) {
        this.updateByline(bylineTag, credit);
      }
    });
  }

  debounce(cb, duration) {
    return (...args) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        cb(...args);
      }, duration);
    };
  }

  async saveAll() {
    this.saveOperations.forEach(async (value, key) => {
      let operation = value;

      const data = new URLSearchParams();
      for (const [key, value] of Object.entries(operation)) {
        data.append(key, value);
      }

      let response = fetch(ajaxurl + "?action=webpress_save_byline", {
        method: "POST",
        body: data,
      }).then((response) => response.json());

      this.cache.set(key, response);
      this.saveOperations.delete(key);
    });
    this.subscribe(undefined, undefined);
  }

  async save(mediaId, bylineId, creditLine, url) {
    let byline = {
      id: mediaId,
      byline_author: bylineId,
      byline_credit_line: creditLine,
    };
    this.saveOperations.set(mediaId, byline);
    this.urlMap.delete(url);
    this.saveDebounced();
  }

  async creditForUrl(url: string) {
    if (!this.urlMap.has(url)) {
      const data = new URLSearchParams();
      data.append("src", url);
      data.append("readonly", "1");

      let promise = fetch(ajaxurl + "?action=webpress_save_byline", {
        method: "POST",
        body: data,
      }).then((response) => response.json());
      this.urlMap.set(url, promise);

      let mediaId = ((await this.urlMap.get(url)) as any).media;
      this.cache.set(mediaId, this.urlMap.get(url));
    }

    let mediaId = ((await this.urlMap.get(url)) as any).media;
    return this.load(mediaId);
  }

  async load(mediaId): Promise<MediaByline> {
    if (!mediaId) {
      return undefined;
    }
    if (!this.cache.has(mediaId)) {
      const data = new URLSearchParams();
      data.append("id", mediaId);
      data.append("readonly", "1");

      let promise = fetch(ajaxurl + "?action=webpress_save_byline", {
        method: "POST",
        body: data,
      }).then((response) => response.json());
      this.cache.set(mediaId, promise);
    }
    return this.cache.get(mediaId);
  }

  updateByline(byline: Element, credit: MediaByline) {
    for (var i = 0; i < byline.children.length; i++) {
      byline.removeChild(byline.children[i]);
    }

    byline.textContent = null;
    byline.innerHTML = credit.innerHtml;
  }

  installByline(dom: Element) {
    if (!dom) {
      return;
    }

    dom = dom as unknown as Element;

    if (!dom || dom.nodeName != "FIGURE") {
      return;
    }

    let existingByline = dom.querySelector(".byline-wrapper");

    if (existingByline != undefined) {
      return existingByline;
    }

    let byline = document.createElement("span", {});
    byline.classList.add("byline-wrapper");

    dom.append(byline);

    return byline;
  }
}

addFilter("blocks.registerBlockType", "example/filter-blocks", (settings) => {
  if (settings.name !== "core/image") {
    return settings;
  }

  const newSettings = {
    ...settings,
    attributes: {
      ...settings.attributes,
    },
    edit: (props) => (
      <ImageWrapper id={props.attributes.id} attributes={props.attributes}>
        {settings.edit(props)}
      </ImageWrapper>
    ),
  };
  return newSettings;
});

class ImageWrapper extends React.Component<any, { byline: MediaByline }> {
  render() {
    return this.props.children;
  }

  componentDidUpdate() {
    MediaCreditManager.shared.subscribe(undefined, undefined);
  }
}

addFilter(
  "editor.BlockEdit",
  "webpress/media-credit",
  createHigherOrderComponent((BlockEdit) => {
    let mediaManager = MediaCreditManager.shared;

    return (props) => {
      if ("core/image" !== (props as unknown as any).name) {
        return <BlockEdit {...props} />;
      }

      const { attributes, setAttributes } = props as unknown as any;
      const [userLocked, setUserLocked] = useState(false);

      const [byline, setByline] = useState<MediaByline>(undefined);

      const [meta, setMeta] = useEntityProp(
        "postType",
        "attachment",
        "meta",
        attributes.id
      );

      console.log("METTAAA", meta);
      /*
      if ( && !byline) {
        mediaManager.creditForUrl(attributes.url).then((loadedByline) => {
          if (!byline) {
            setByline(loadedByline);
          }
        });

        return <Fragment>"loading..."</Fragment>;
      }
      */

      return (
        <Fragment>
          <BlockEdit {...props} />
          <InspectorControls>
            <PanelBody title={"Attribution"}>
              <SelectControl
                label="Byline User"
                value={byline ? byline.author_id : ""}
                options={[{ label: "", value: "" }, ...webpress_users.users]}
                onChange={async (newBylineId) => {
                  MediaCreditManager.shared.save(
                    attributes.id,
                    newBylineId,
                    "The Badger Herald",
                    attributes.url
                  );
                  setByline({
                    ...byline,
                    author_id: newBylineId,
                    author: "The Badger Herald",
                  });
                  setUserLocked(true);
                }}
              />

              <a
                style={{
                  color: "red",
                  fontSize: "0.8em",
                  position: "relative",
                  top: "-20px",
                  cursor: "pointer",
                }}
                onClick={async (_) => {
                  setByline(undefined);
                  setUserLocked(false);
                  MediaCreditManager.shared.save(
                    attributes.id,
                    "",
                    "",
                    attributes.url
                  );
                }}
              >
                Remove byline
              </a>

              <TextControl
                label="Credit"
                className="exa-user-select"
                onChange={(newCreditLine) => {
                  setByline({ ...byline, creditLine: newCreditLine });
                  MediaCreditManager.shared.save(
                    attributes.id,
                    "",
                    newCreditLine,
                    attributes.url
                  );
                }}
                type="text"
                value={byline ? byline.creditLine : ""}
                disabled={userLocked}
              />
            </PanelBody>
          </InspectorControls>
        </Fragment>
      );
    };
  }, "withInspectorControl")
);
