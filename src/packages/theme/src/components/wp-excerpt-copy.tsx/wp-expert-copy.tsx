import { Component,  h, Prop, Host } from '@stencil/core';
import { Single } from '@webpress/core'

@Component({
  tag: 'wp-excerpt-copy'
})
export class ExerptCopy {
  @Prop() post : Single 

  render() {
    if(!this.post || !this.post.excerpt) {
      return
    }
    return <Host innerHTML={this.post.excerpt} />
  }
}
