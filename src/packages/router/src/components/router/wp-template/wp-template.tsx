import { Component, h, Prop } from '@stencil/core';
import { Template, Single } from '@webpress/core'

@Component({
  tag: 'wp-template',
})

export class WPTemplate<T extends Single> implements Template.Contextual<T> {
  query: Template.Query<T>;
  hidden: boolean;
  @Prop() definition: Template.Properties
  @Prop() component: string 

  render() {
    const ChildComponent = this.component
    return (
      <ChildComponent query={this.query} />
    )
  }
}

