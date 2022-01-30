import { Component, Element, Prop, h, State } from "@stencil/core";
import { LinkedQueryArgs } from "../../model/Linked";
import { Connection, Media, Query, Route } from "./../../model/Index";

declare const exa: any;
@Component({
  tag: "wp-gutenberg-media",
  styles: ".media-byline { \
      display:block; \
    }",
})
export class WebpressGutenbergMedia {
  @Prop() global: Connection.Context;

  @Element() el: HTMLElement;

  @State() id: number;

  private media: Media;
  private connection: Connection;

  async componentWillLoad() {
    if (!this.connection) {
      this.connection = new Connection(this.global.serverInfo);
    }

    this.el.querySelector("img").classList.forEach((cls) => {
      if (cls.startsWith("wp-image-")) {
        this.id = Number.parseInt(cls.substr(9), 10);
      }
    });

    if (this.id && !this.media) {
      this.media = await new Query(
        this.connection,
        new LinkedQueryArgs(Media, new Route("media"), this.id)
      ).result;
    }
  }

  render() {
    return <slot />;
  }

  componentDidRender() {
    if (!this.media || !this.media.byline || !this.media.byline.author) {
      return;
    }

    var caption = this.el.querySelector("figure");

    if (!caption) {
      return;
    }

    let credit = document.createElement("span", {});
    credit.classList.add("byline");
    credit.append(this.media.byline.author);

    if (this.media.byline.creditLine) {
      let creditLine = document.createElement("span", {});
      creditLine.classList.add("creditline");
      creditLine.append(this.media.byline.creditLine);
      credit.append(creditLine);
    }

    caption.append(credit);
  }
}
