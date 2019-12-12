import { Component,  h, Prop } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-title'
})
export class WebpressPost {
  @Prop() post : Post 

  render() {
    if(!this.post) {
      return
    }
    return <h1>{this.post.title}</h1>
  }
}
