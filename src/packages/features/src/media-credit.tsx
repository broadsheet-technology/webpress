import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent, compose } from "@wordpress/compose";
import {
  findDOMNode,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, SelectControl } from "@wordpress/components";

import * as React from "react";

declare const ajaxurl: any;
declare const exa_user_select: any;

class MediaCreditManager {
  private cache = new Map();

  constructor() {}
  save(media, user, creditLine) {
    fetch(ajaxurl + "?action=webpress_save_byline", {
      method: "POST",
      body: JSON.stringify({
        id: media,
        readonly: false,
        byline_author: user,
        byline_credit_line: creditLine,
      }),
    });
  }
  load(media): Promise<{
    author: string;
    author_id: string;
    creditLine: string;
  }> {
    if (!this.cache[media]) {
      this.cache[media] = fetch(ajaxurl + "?action=webpress_save_byline", {
        method: "POST",
        body: JSON.stringify({
          id: media,
          readonly: true,
        }),
      }).then((response) => response.json());
    }
    return this.cache[media];
  }
  reset(media) {
    this.cache[media] = undefined;
  }
}

const addBylineAttributesToImageBlock = (settings) => {
  if (settings.name !== "core/image") {
    return settings;
  }

  console.log(settings);

  const newSettings = {
    ...settings,
    attributes: {
      ...settings.attributes,
      creditLine: {
        // here is our new attribute
        type: "string",
        default: "",
      },
      bylineId: {
        // here is our new attribute
        type: "string",
        default: "",
      },
    },
    edit: (props) => (
      <ImageWrapper
        bylineAuthor={props.attributes.bylineId}
        bylineCreditLine={props.attributes.creditLine}
        id={props.attributes.id}
      >
        {new settings.edit(props).render()}
      </ImageWrapper>
    ),
  };
  return newSettings;
};
addFilter(
  "blocks.registerBlockType",
  "example/filter-blocks",
  addBylineAttributesToImageBlock
);

class ImageWrapper extends React.Component<
  {
    bylineAuthor: string;
    bylineCreditLine: string;
    id: number;
  },
  { bylineAuthor: string; bylineCreditLine: string }
> {
  async componentDidMount() {
    await new MediaCreditManager().load(this.props.id).then((byline) => {
      this.setState({
        bylineAuthor: byline.author,
        bylineCreditLine: byline.creditLine,
      });
    });
  }

  render() {
    return this.props.children;
  }

  componentDidUpdate() {
    const attributes = this.props;
    var bylineAuthor;
    var bylineCreditLine;

    if (this.props && this.props.bylineAuthor) {
      bylineAuthor = this.props.bylineAuthor;
      bylineCreditLine = this.props.bylineCreditLine;
    } else if (this.props && this.props.bylineCreditLine) {
      bylineAuthor = null;
      bylineCreditLine = this.props.bylineCreditLine;
    } else {
      (bylineAuthor = this.state.bylineAuthor),
        (bylineCreditLine = this.state.bylineCreditLine);
    }
    if (
      !attributes ||
      !attributes.bylineAuthor ||
      !attributes.bylineCreditLine
    ) {
      return;
    }

    var dom = findDOMNode(this);
    if (!dom) {
      return;
    }

    dom = dom as unknown as Element;

    if (!dom || dom.nodeName != "FIGURE") {
      return;
    }

    let byline = dom.querySelector("span.byline");

    if (byline) {
      for (var i = 0; i < byline.children.length; i++) {
        byline.removeChild(byline.children[i]);
      }
      byline.textContent = null;
    } else {
      byline = document.createElement("span", {});
      byline.classList.add("byline");
    }

    byline.append(attributes.bylineAuthor);

    if (attributes.bylineCreditLine) {
      let creditLine = document.createElement("span", {});
      creditLine.classList.add("media-creditline");
      creditLine.append("/" + attributes.bylineCreditLine);
      byline.append(creditLine);
    }

    dom.append(byline);
  }
}

// Edit...
const addAttributionToBlockImageBlockEditor = createHigherOrderComponent(
  (BlockEdit) => {
    let mediaManager = new MediaCreditManager();

    return (props) => {
      if ("core/image" !== (props as unknown as any).name) {
        return <BlockEdit {...props} />;
      }

      const { attributes, setAttributes } = props as unknown as any;
      const [userLocked, setUserLocked] = useState(false);
      const [userDidInteract, setUserDidInteract] = useState(false);

      mediaManager.load(attributes.id).then((byline) => {
        if (
          !attributes.bylineId &&
          !attributes.creditLine &&
          !userDidInteract
        ) {
          setAttributes({
            bylineId: byline.author_id,
            creditLine: byline.creditLine,
          });
        }
      });

      return (
        <Fragment>
          <BlockEdit {...props} />
          <InspectorControls>
            <PanelBody title={"Attribution"}>
              <SelectControl
                label="Byline User"
                value={attributes.bylineId}
                options={[{ label: "", value: "" }, ...exa_user_select.users]}
                onChange={(byline) => {
                  setAttributes({
                    bylineId: byline,
                    creditLine: "The Badger Herald",
                  });
                  setUserLocked(true);
                }}
              />
              {userLocked ? (
                <a
                  style={{
                    color: "red",
                    fontSize: "0.8em",
                    position: "relative",
                    top: "-20px",
                    cursor: "pointer",
                  }}
                  onClick={(_) => {
                    setUserLocked(false);
                    setUserDidInteract(true);
                    setAttributes({
                      bylineId: "",
                      creditLine: "",
                    });
                  }}
                >
                  Remove byline
                </a>
              ) : null}
              <TextControl
                label="Credit"
                className="exa-user-select"
                onChange={(credit) => setAttributes({ creditLine: credit })}
                type="text"
                value={attributes.creditLine}
                disabled={userLocked}
              />
            </PanelBody>
          </InspectorControls>
        </Fragment>
      );
    };
  },
  "withInspectorControl"
);

addFilter(
  "editor.BlockEdit",
  "webpress/media-credit",
  addAttributionToBlockImageBlockEditor
);

addFilter(
  "blocks.getSaveElement",
  "webpress/media-credit",
  (element, block, attributes) => {
    if ("core/image" !== block.name) {
      return element;
    }

    console.log("saving", element, block, attributes);

    new MediaCreditManager().save(
      attributes.id,
      attributes.bylineId,
      attributes.creditLine
    );

    return element;
  }
);
