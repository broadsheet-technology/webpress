import { Component,  h, Prop } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-running-copy'
})
export class WebpressRunningCopy {

  @Prop() post : Post 
  render() {
    if(!this.post) {
      return
    }
    console.log(this.post.content)
    return <div innerHTML={this.post.content} />
  }
}
