import { Component, h } from '@stencil/core';

@Component({
  tag: 'wp-home',
  styleUrl: 'wp-home.scss',
})
export class WebpressHome {
  render() {
    return <h2>This is home</h2>
  }
}
