import { Component,  h, Prop, Host } from '@stencil/core';
import { Single } from '@webpress/core'

@Component({
  tag: 'wp-running-copy'
})
export class WebpressRunningCopy {

  @Prop() post : Single 
  @Prop() content : string

  render() {
    if(!this.post || !this.post.content) {
      return
    }
    return <Host innerHTML={this.content ? this.content : this.post.content}></Host>
  }
}
