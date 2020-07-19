import { Component,  h, Prop, Host } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-running-copy'
})
export class WebpressRunningCopy {

  @Prop() post : Post 
  @Prop() content : string

  render() {
    if(!this.post || !this.post.content) {
      return
    }
    return <Host innerHTML={this.content ? this.content : this.post.content}></Host>
  }
}
