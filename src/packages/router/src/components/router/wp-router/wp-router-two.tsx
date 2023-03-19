import { Component, Element, Prop, h } from "@stencil/core";
import { Query, Template } from "@webpress/core";
import { Hierarchy } from "../../../model/Hierarchy";

@Component({
  tag: "wp-router-two",
})
export class Router {
  @Element() el!: HTMLElement;
  @Prop() query: Query<Template>;
  @Prop() hiearchy: Hierarchy.TemplateHierarchy;

  private template: Template;

  async componentWillRender() {
    if (!this.query) {
      return;
    }
    this.template = await this.query.result;
  }

  render() {
    if (!this.query || !this.hiearchy) {
      return;
    }

    let definition = Hierarchy.Resolve(this.hiearchy, this.template);
    let query = { query: this.template.globalQuery };

    return h(definition.component, {
      ...query,
      ...definition.props,
    });
  }
}
