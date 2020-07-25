import { Component, Prop, h } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-subhead'
})
export class WebpressPost {
  @Prop() post: Post 

  @Prop() el : string

  render() {
    if(!this.post) {
      return
    }
    let Element = this.el ? this.el : "h3"
    return <Element innerHTML={this.post.subhead} />
  }
}
