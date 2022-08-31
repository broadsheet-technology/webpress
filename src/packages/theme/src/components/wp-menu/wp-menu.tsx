import { Component, Prop, State, h } from "@stencil/core";
import { MenuItem, Menu, Query } from "@webpress/core";

export interface WebpressMenuOptions {
  classForMenuItem: (item: MenuItem) => string;
  domForItem: (item: MenuItem) => HTMLElement;
}

@Component({
  tag: "wp-menu",
})
export class WebpressMenu {
  @Prop() query: Query<Menu>;
  @Prop() options: WebpressMenuOptions;

  private menu: Menu;

  @State() activeMenuItem: MenuItem;

  async componentWillRender() {
    if (!this.query) {
      return;
    }
    this.menu = await this.query.result;
  }

  render() {
    if (!this.menu) {
      return;
    }
    return this.renderMenu(this.menu);
  }

  private renderMenu(menu: Menu) {
    return (
      <menu>
        {menu.items.map((item: MenuItem) => this.renderMenuItem(item))}
      </menu>
    );
  }

  private renderMenuItem(item: MenuItem) {
    let classes = this.menuItemClasses(item);
    let linkDom =
      this.options && this.options.domForItem
        ? this.options.domForItem(item)
        : item.title;
    return (
      <li class={classes}>
        <wp-link object={item}>{linkDom}</wp-link>
        {item.children ? this.renderMenu(item.children) : undefined}
      </li>
    );
  }

  private menuItemClasses(item: MenuItem) {
    return (
      (item === this.activeMenuItem ? "active " : "") +
      (this.options && this.options.classForMenuItem
        ? this.options.classForMenuItem(item)
        : "") +
      (item.children ? " hasChildren" : "")
    );
  }
}
