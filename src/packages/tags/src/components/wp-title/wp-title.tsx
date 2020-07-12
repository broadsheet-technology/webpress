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
    if(this.permalink) {
      return <wp-link object={this.post}><h1 innerHTML={this.post.title} /></wp-link>
    }
    return <h1 innerHTML={this.post.title} />
  }
}
