import { Component, Prop, h } from '@stencil/core';
import { Template } from '@webpress/core';

@Component({
  styleUrl: 'starter-sidebar.scss',
  tag: 'starter-sidebar',
})
export class StarterSidebar {
  @Prop() query : Template.Query

  render() {
    return <div class="sidebar">
      <h1>webpress</h1>
      <div class="widget search">
        <input type="text" placeholder="search" />
      </div>
      <div class="widget">
        <h3>About this site</h3>
        <p>This site is built with webpress — a modern toolkit for WordPress development. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse.</p>
        <p><a href="#">About</a> &middot; <a href="#">GitHub</a></p>
      </div>
    </div>;
  }
}
