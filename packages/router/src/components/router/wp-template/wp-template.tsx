import { Component, h, Prop } from '@stencil/core';
import { TemplateArgs, TemplateContextual } from '../../../global/index';
import { Query } from '@webpress/core'

@Component({
  tag: 'wp-template',
})

export class WPTemplate implements TemplateContextual {
  @Prop() args: TemplateArgs
  @Prop() query: Query

  hidden: boolean

  @Prop() menus
  @Prop() sidebars

  @Prop() component : string 
  @Prop() componentProps?: { [key: string]: any } = {};

  render() {
    const ChildComponent = this.component
    return (
      <ChildComponent query={this.query} />
    ); 
  }
}

