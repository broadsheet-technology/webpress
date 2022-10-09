import { Component, Prop, h } from "@stencil/core";
import { Single } from "@webpress/core";

@Component({
  tag: "wp-date",
})
export class WebpressDate {
  @Prop() post: Single;

  @Prop() el: string;

  render() {
    var options = { year: "numeric", month: "long", day: "numeric" };

    if (!this.post) {
      return;
    }

    let Elem = this.el ? this.el : "span";
    return <Elem>{this.post.date.toLocaleDateString("en-US", options)}</Elem>;
  }
}
