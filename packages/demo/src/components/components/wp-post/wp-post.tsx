import { Component, h, Prop } from '@stencil/core';
import { Query } from '@webpress/core';
import { QueryContextual } from '@webpress/router';

@Component({
  tag: 'wp-post',
  styleUrl: 'wp-post.scss',
})
export class WebpressPost implements QueryContextual  {
  @Prop() query: Query 
  render() {
    console.log(this.query)
    return [
      <h2>This is a ~Post~</h2>
    ]
  }
}
