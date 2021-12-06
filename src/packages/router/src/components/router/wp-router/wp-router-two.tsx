import { Component, Element, h, Prop } from "@stencil/core";
import { Template } from "@webpress/core";
import { Hierarchy } from "../../../model/Hierarchy";

@Component({
  tag: "wp-router-two",
})
export class Router {
  @Element() el!: HTMLElement;
  @Prop() query: Template.Query;
  @Prop() hiearchy: Hierarchy.TemplateHierarchy;

  private template: Template;

  async componentWillRender() {
    if (!this.query) {
      return;
    }
    this.template = await this.query.template;
  }

  render() {
    if (!this.query || !this.hiearchy) {
      console.log("Router has no Query and/or Hiearchy");
      return;
    }

    let definition = Hierarchy.Resolve(this.hiearchy, this.template);

    if (!definition) {
      console.error("No template resolved!");
    }

    console.log("def", definition);

    let Component =
      definition instanceof Object ? definition.component : definition;
    let props = definition instanceof Object ? definition.props || [] : [];

    return <Component {...props} query={this.query} />;
  }
}
