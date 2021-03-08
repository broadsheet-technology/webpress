import { Component, h, Prop } from '@stencil/core';
import { Template } from '@webpress/core'

@Component({
  tag: 'wp-template',
})

export class WPTemplate implements Template.Contextual {
  hidden: boolean;

  @Prop() query: Template.Query;
  @Prop() definition: Template.Properties
  @Prop() component: string 

  render() {
    const ChildComponent = this.component
    return (
      <ChildComponent query={this.query} />
    )
  }
}

