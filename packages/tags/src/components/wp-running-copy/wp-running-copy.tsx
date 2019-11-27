import { Component,  h, Prop } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-running-copy'
})
export class WebpressRunningCopy {

  @Prop() post : Post 
  render() {
    console.log("running copy")
    return <div innerHTML={this.post.content}></div>
  }
}
