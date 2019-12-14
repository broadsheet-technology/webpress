import { Component,  h, Prop } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-title'
})
export class WebpressPost {
  @Prop() post : Post 
  @Prop() permalink : boolean

  render() {
    if(!this.post) {
      return
    }
    return <h1 innerHTML={this.post.title} />
  }
}
