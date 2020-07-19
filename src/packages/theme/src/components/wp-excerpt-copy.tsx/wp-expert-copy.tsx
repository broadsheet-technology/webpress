import { Component,  h, Prop, Host } from '@stencil/core';
import { Post } from '@webpress/core'

@Component({
  tag: 'wp-excerpt-copy'
})
export class ExerptCopy {

  @Prop() post : Post 

  render() {
    if(!this.post || !this.post.excerpt) {
      return
    }
    return <Host innerHTML={this.post.excerpt} />
  }
}
