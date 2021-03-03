import { Component, h, Prop } from '@stencil/core';
import { TemplateParams, Query, Template } from '@webpress/core'

@Component({
  tag: 'wp-template',
})

export class WPTemplate {
  @Prop() args: TemplateParams
  hidden: boolean

  @Prop() query : Query<Template>

  @Prop() component : string 
  @Prop() componentProps?: { [key: string]: any } = {}

  render() {
    const ChildComponent = this.component
    return (
      <ChildComponent query={this.query} />
    )
  }
}

