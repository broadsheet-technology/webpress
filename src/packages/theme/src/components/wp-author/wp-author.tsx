import { Component, Prop, h } from '@stencil/core';
import { Author } from '@webpress/core'

@Component({
  tag: 'wp-author'
})
export class WebpressAuthor {
  @Prop() author : Author 
  @Prop() permalink : boolean

  render() {
    if(!this.author) {
      return
    }
    return [
      <img src={this.author.avatarSrc} />,
      this.author.name]
  }
}
