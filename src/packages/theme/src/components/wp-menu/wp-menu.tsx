import { Component} from '@stencil/core';
import { MenuItem } from '@webpress/core';

export interface WebpressMenuOptions {
  classForMenuItem: (item : MenuItem) => string
  domForItem: (item : MenuItem) => HTMLElement 
}

@Component({
  tag: 'wp-menu',
})
export class WebpressMenu {  
 // @Prop() menu: Menu
 // @Prop() query: Query
 // @Prop() options: WebpressMenuOptions

  /*
  @State() activeMenuItem: MenuItem
  
  async componentWillRender() {
    if(!this.query || !this.menu) {
      return
    }
    let template = await this.query.template 
    let post = (await this.query.objects)[0]
    this.activeMenuItem = this.menu.items.find(item => item.isActive(post, template))
  }

  render() {  
    if (!this.menu) {
      return;
    }
    return this.renderMenu(this.menu)
  }

  private renderMenu(menu : Menu) {
    return <menu>
      {menu.items.map((item: MenuItem) => 
        this.renderMenuItem(item)
      )}
    </menu>
  }

  private renderMenuItem(item: MenuItem) {
    let classes = this.menuItemClasses(item)
    let linkDom = this.options && this.options.domForItem  ? this.options.domForItem(item) : item.title
    return <li class={classes}>
      <wp-link object={item}>{linkDom}</wp-link>
      {item.children ? this.renderMenu(item.children) : undefined}
    </li>
  }

  private menuItemClasses(item : MenuItem) {
    return (item === this.activeMenuItem ? "active " : "") 
              + (this.options && this.options.classForMenuItem  ? this.options.classForMenuItem(item) : "")
              + (item.children ? " hasChildren" : "")
  }
  */
}
