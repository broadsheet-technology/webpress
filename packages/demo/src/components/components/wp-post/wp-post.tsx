import { Component, h } from '@stencil/core';

@Component({
  tag: 'wp-post',
  styleUrl: 'wp-post.scss',
})
export class WebpressPost {
  render() {
    return <h2>This is a ~Post~</h2>
  }
}
