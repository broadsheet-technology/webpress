import { Component, h, Prop, State } from '@stencil/core';
import { Query, Post } from '@webpress/core';
import { QueryContextual } from '@webpress/router';
import '@webpress/tags'

@Component({
  tag: 'wp-post',
  styleUrl: 'wp-post.scss',
})
export class WebpressPost implements QueryContextual  {
  @Prop() query: Query 
  @State() post: Post

  async componentWillUpdate() {
    if(!this.post) {
      this.post = (await this.query.posts)[0]
    }
    console.log(this.post)
  }

  render() {
    if(!this.query || !this.post) {
      return
    }
    return (
      <wp-broadsheet>
        <wp-title post={this.post}></wp-title>
        <wp-running-copy post={this.post}></wp-running-copy>
      </wp-broadsheet>
    )
  }
}
