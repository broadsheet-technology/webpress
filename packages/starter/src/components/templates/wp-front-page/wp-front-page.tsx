import { Component, h, Prop } from '@stencil/core';
import { Query } from '@webpress/core';

@Component({
  tag: 'wp-front-page',
  styleUrl: 'wp-front-page.scss',
})
export class WebpressPage {

  @Prop() query : Query

  render() {
    return <h2>It's a Front Page!</h2>
  }
}
