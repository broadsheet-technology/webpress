import { Component, Prop, h, State } from '@stencil/core';
import { Menu, TemplateQuery, MenuItem } from '@webpress/core';

export interface WebpressMenuOptions {
  classForMenuItem: (item : MenuItem) => string
}

@Component({
  tag: 'wp-menu',
})
export class WebpressMenu {  
  @Prop() menu: Menu
  @Prop() query: TemplateQuery

  @State() activeMenuItem: MenuItem

  @Prop() options: WebpressMenuOptions

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
        {this.menu.items.map((item: MenuItem) => {
          let classes = (item === this.activeMenuItem ? "active " : "") + (this.options && this.options.classForMenuItem  ? this.options.classForMenuItem(item) : "")
          return <li class={classes}><wp-link object={item}>{item.title}</wp-link></li>
        })}
      </menu>
    );  
  }
}
