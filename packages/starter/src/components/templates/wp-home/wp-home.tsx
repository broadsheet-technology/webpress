import { Component, h } from '@stencil/core';

@Component({
  tag: 'wp-home',
  styleUrl: 'wp-home.scss',
})
export class WebpressHome {
  render() {
    return <wp-broadsheet><h2>This is home</h2></wp-broadsheet>
  }
}
