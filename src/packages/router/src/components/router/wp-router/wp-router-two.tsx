import { Component, Element, Prop } from "@stencil/core";
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
      return;
    }

    let definition = Hierarchy.Resolve(this.hiearchy, this.template);

    return definition;
  }
}
