import { Component, h, Prop } from '@stencil/core';
import { Query } from '@webpress/core';
import { QueryContextual } from '@webpress/router';
import '@webpress/tags'

@Component({
  tag: 'wp-post',
  styleUrl: 'wp-post.scss',
})
export class WebpressPost implements QueryContextual  {
  
  @Prop() query: Query 

  render() {
    console.log("rendering...")
    if(!this.query) {
      console.log("no query")
      return
    }
    return [
      <wp-title post={this.query.posts[0]}></wp-title>,
      <h2>This is a ~Post~</h2>
    ]
  }
}
