import { Component, Prop, h } from "@stencil/core";
import { Single } from "@webpress/core";

@Component({
  tag: "wp-title",
})
export class WebpressPost {
  @Prop() post: Single;
  @Prop() permalink: boolean;

  @Prop() el: string;

  render() {
    if (!this.post) {
      return;
    }
    let Element = this.el ? this.el : "h1";
    if (this.permalink) {
      return (
        <wp-link object={this.post}>
          <Element innerHTML={this.post.title} />
        </wp-link>
      );
    }
    return <Element innerHTML={this.post.title} />;
  }
}
