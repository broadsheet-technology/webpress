import { Component, h, Prop } from '@stencil/core';
import { Query } from '@webpress/core';

@Component({
  tag: 'wp-page',
  styleUrl: 'wp-page.scss',
})
export class WebpressPage {

  @Prop() query : Query

  render() {
    return <h2>It's a Page!</h2>
  }
}
