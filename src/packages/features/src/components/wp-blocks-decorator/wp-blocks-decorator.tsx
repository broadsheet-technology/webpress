import { Component, Element, Prop, State, h, forceUpdate } from "@stencil/core";
import {
  Connection,
  Query,
  Route,
  Media,
  LinkedQueryArgs,
} from "@webpress/core";
declare const exa: any;

@Component({
  tag: "wp-blocks-decorator",

  /**
   * z-index: makes caption selectable on floated images
   * width: resets block's given column width
   */
  styles: " \
    .media-byline { \
      display: block; \
    }",
})
export class WebpressBlockImageDecorator {
  @Prop() global: Connection.Context;

  @Element() el: HTMLElement;
  @State() medias: Map<number, Media>;

  private elements = new Map<HTMLElement, number>();
  private connection: Connection;

  async componentWillLoad() {
    if (!this.connection) {
      this.connection = new Connection(this.global.serverInfo);
    }

    this.el.querySelectorAll("img").forEach((img) => {
      img.classList.forEach((cls) => {
        if (cls.startsWith("wp-image-")) {
          this.elements.set(
            img.closest("figure"),
            Number.parseInt(cls.substr(9), 10)
          );
        }
      });
    });

    console.log("HERE ARE THE IDs", this.elements);
  }

  async componentDidLoad() {
    if (this.elements.size > 0 && !this.medias) {
      console.log("TRYING");
      let media = new Map<number, Media>();
      let promises = [];
      try {
        this.elements.forEach(async (id, key) => {
          console.log("QUERY FOR", id, key);
          let mediaInst = await new Query(
            this.connection,
            new LinkedQueryArgs(Media, new Route("media"), id)
          ).result;
          media.set(id, mediaInst);
          forceUpdate(this);
        });
      } catch {
        console.log("FUCCCK");
      }
      await Promise.all(promises);
      this.medias = media;
    } else {
      console.log("SKIEPPED!", this.elements.size, this.medias);
    }
    console.log("HERE ARE THE MEDIAS", this.medias);
  }

  render() {
    return <slot />;
  }

  componentDidRender() {
    if (!this.medias) {
      return;
    }

    this.elements.forEach((id, fig) => {
      console.log("ID:", id, "FIG:", fig, this.medias);
      if (!fig) {
        return;
      }

      if (fig.querySelector(".byline")) {
        return;
      }

      if (!this.medias.has(id)) {
        console.log("no media:", id, "FIG:", fig);
        return;
      }

      let mediaCredit = this.medias.get(id);

      if (!mediaCredit.byline || !mediaCredit.byline.author) {
        console.log("media credit null:", mediaCredit);
        return;
      }

      console.log("media credit:", mediaCredit);

      let credit = document.createElement("span", {});
      credit.classList.add("byline");
      credit.append(mediaCredit.byline.author);

      if (mediaCredit.byline.creditLine) {
        let creditLine = document.createElement("span", {});
        creditLine.classList.add("creditline");
        creditLine.append(mediaCredit.byline.creditLine);
        credit.append(creditLine);
      }

      fig.append(credit);
    });
  }
}
