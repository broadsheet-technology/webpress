import { Component, Prop, State, h, Listen } from "@stencil/core";
import { Connection, Theme, Template, Query } from "@webpress/core";

@Component({
  tag: "webpress-theme",
})
export class WebpressTheme {
  @Prop() global: Connection.Context;

  private connection: Connection;
  @State() query: Query<Template>;

  async componentWillLoad() {
    this.connection = new Connection(
      this.global.serverInfo,
      this.global.preloaded
    );
  }

  @Listen("webpressRouterNavigation")
  async updateTemplate(event: any) {
    let path = event.detail.url;
    window.history.pushState(path, "here!!", path);
    this.query = new Query(
      this.connection,
      Template.QueryArgs({
        path: path,
      })
    );
  }

  @Listen("popstate", { target: "window" })
  async handleBackButton(event) {
    this.query = new Query(
      this.connection,
      Template.QueryArgs({
        path: event.state,
      })
    );
  }

  async componentWillRender() {
    this.query = new Query(
      this.connection,
      Template.QueryArgs({
        path: window.location.pathname,
      })
    );
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
