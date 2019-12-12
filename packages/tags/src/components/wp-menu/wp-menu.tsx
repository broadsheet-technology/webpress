import { Component, Prop, h, State } from '@stencil/core';
import { Menu, TemplateQuery, MenuItem } from '@webpress/core';

@Component({
  tag: 'wp-menu',
})
export class WebpressMenu {  
  @Prop() menu: Menu
  @Prop() query: TemplateQuery

  @State() activeMenuItem: MenuItem

  async componentWillRender() {
    if(!this.query) {
      return
    }
    let template = await this.query.template 
    let post = (await this.query.posts)[0]
    this.activeMenuItem = this.menu.items.find(item => item.isActive(post, template))
  }

  render() {
    if(!this.menu) {
      return;
    }
   
    return (
      <menu>
        {this.menu.items.map((item) => 
          <li class={item === this.activeMenuItem ? "active" : ""}><a href={item.url}>{item.title}</a></li>
        )}
      </menu>
    );  
  }
}
