import { Component,  h, Prop } from '@stencil/core';
import { Media } from '@webpress/core'

@Component({
  tag: 'wp-media'
})
export class WebpressMedia {
  @Prop() media : Media 

  render() {
    return this.media ? <img src={this.media.src} /> : undefined
  }
}
