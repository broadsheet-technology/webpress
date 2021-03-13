import { Component, Prop, h } from '@stencil/core';
import { Post, Template } from '@webpress/core';

@Component({
  styleUrl: 'starter-index.scss',
  tag: 'starter-index',
})
export class StarterSideBar {
  @Prop() query : Template.Query<Post>

  private posts : Post[]
  async componentWillRender() {
    this.posts = await this.query.results
  }

  render() {
    return <starter-layout>
      <starter-sidebar slot="sidebar" />
      <div slot="page" >
        <div class="thing">
          { this.posts.map(post => <div class="post">
            <wp-title post={post} />
            <wp-excerpt-copy post={post} />
            </div>)
          }
        </div>
      </div>
    </starter-layout>;
  }
}
