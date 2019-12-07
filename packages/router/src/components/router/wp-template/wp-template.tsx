import { Component, h, Prop } from '@stencil/core';
import { TemplateArgs, TemplateContextual } from '../../../global/index';
import { Query } from '@webpress/core'

@Component({
  tag: 'wp-template',
})

export class WPTemplate implements TemplateContextual {
  args: TemplateArgs
  hidden: boolean

  @Prop() query : Query
  @Prop() menus : any[]
  @Prop() sidebars : any[]

  @Prop() component : string 
  @Prop() componentProps?: { [key: string]: any } = {}

  render() {
    const ChildComponent = this.component
    return (
      <ChildComponent query={this.query} />
    )
  }
}

