import { Component, h } from '@stencil/core';

@Component({
  tag: 'wp-page',
  styleUrl: 'wp-page.scss',
})
export class WebpressPage {
  render() {
    return <h2>It's a Page!</h2>
  }
}
