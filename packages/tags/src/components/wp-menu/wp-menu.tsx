import { Component, Prop, h } from '@stencil/core';
import { WebpressConnection, Menu } from '@webpress/core';

@Component({
  tag: 'wp-menu',
})
export class ExaMenu {  

  @Prop() connection : WebpressConnection
  @Prop() menu: Menu

  render() {
    if(!this.menu || !this.connection) {
      return;
    }
    console.log(this.menu)
    return (
      <menu>
        asdfas
        {this.menu.json.items.map((menuItem) => 
          <li><a href={menuItem.url}>{menuItem.title}</a></li>
        )}
      </menu>
    );  
  } 
}
