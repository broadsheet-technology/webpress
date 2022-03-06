import { Component, Prop, State, h, Listen } from "@stencil/core";
import { Connection, Theme, Template } from "@webpress/core";

@Component({
  tag: "webpress-theme",
})
export class WebpressTheme {
  @Prop() global: Connection.Context;

  private connection: Connection;
  @State() query: Template.Query;

  async componentWillLoad() {
    this.connection = new Connection(this.global.serverInfo);
  }

  @Listen("webpressRouterNavigation")
  async updateTemplate(event: any) {
    let path = event.detail.url;
    window.history.pushState(path, "here!!", path);
    this.query = new Template.Query(this.connection, {
      path: path,
    });
  }

  @Listen("popstate", { target: "window" })
  async handleBackButton(event) {
    this.query = new Template.Query(this.connection, {
      path: event.state,
    });
  }

  async componentWillRender() {
    this.query = new Template.Query(this.connection, {
      path: window.location.pathname,
    });
  }

  render() {
    if (!this.global.theme) {
      return;
    }
    const ThemeRoot = this.global.theme.root;
    return (
      <ThemeRoot
        theme={new Theme(this.connection, this.global.theme)}
        query={this.query}
      />
    );
  }
}
