import { Component, h, Prop } from "@stencil/core";
import { Template, Query } from "@webpress/core";

@Component({
  tag: "wp-template",
})
export class WPTemplate implements Template.Contextual {
  hidden: boolean;

  @Prop() query: Query<Template>;
  @Prop() definition: Template.Properties;
  @Prop() component: string;

  render() {
    const ChildComponent = this.component;
    return <ChildComponent query={this.query} />;
  }
}
