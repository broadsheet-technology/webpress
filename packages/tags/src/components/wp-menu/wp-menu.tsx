import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'wp-menu',
})
export class ExaMenu {  

  @Prop() menu: any

  componentDidLoad() { }

  render() {
    if(this.menu == null) {
      return;
    }
    return (
      <menu>
        // todo
      </menu>
    );  
  } 
}
