import { Component, Element, h, Prop } from "@stencil/core";
import { Template, Query } from "@webpress/core";

@Component({
  tag: "wp-router",
})
export class Router {
  @Element() el!: HTMLElement;
  @Prop() query: Query<Template>;

  private template: Template;

  async componentWillRender() {
    if (!this.query) {
      return;
    }
    this.template = await this.query.result;
    this.templateComponents.map((templateComponent) => {
      templateComponent.hidden = true;
      templateComponent.query = undefined;
    });
  }

  render() {
    if (!this.query) {
      console.log("Router has no Query");
    }
    return this.query ? (
      <slot />
    ) : (
      <div hidden={true}>
        <slot />
      </div>
    );
  }

  async componentDidRender() {
    if (!this.query) {
      console.log("router has no query");
      return;
    }

    console.log("router template args", this.templateComponents);
    let matchedTemplate = Template.Resolve(
      this.template,
      this.templateComponents
    );
    matchedTemplate.query = this.query;
    matchedTemplate.hidden = false;
  }

  private get templateComponents() {
    return Array.from(this.el.children as unknown as Template.Contextual[]);
  }
}
