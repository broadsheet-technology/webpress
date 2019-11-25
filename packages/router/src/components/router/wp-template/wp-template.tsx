import { Component, h, Prop } from '@stencil/core';
import { TemplateMatch, TemplateContextual } from '../../../global/index';

@Component({
  tag: 'wp-template',
})

export class WPTemplate implements TemplateContextual {

  @Prop() query 
  @Prop() match : TemplateMatch
  hidden: boolean

  @Prop() component : string 
  @Prop() componentProps?: { [key: string]: any } = {};

  render() {
    const ChildComponent = this.component
    ChildComponent
    console.log("This query is set!",this.query)
    return (
      <ChildComponent query={this.query} />
    );
    
  }


}

