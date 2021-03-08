import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { Connection, Theme, Template } from '@webpress/core';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  @Prop() global: {
    context: Connection.Context,
    theme: Theme.Definition
  } // json set externally by WordPress theme

  @Element() el: HTMLElement
  @State() query : Template.Query
  private connection : Connection

  @Listen('webpressRouterNavigation') 
  async updateTemplate(event : any) {
    let path = event.detail.url
    window.history.pushState(path ,"here!!", path);
    this.query = new Template.Query(this.connection, {
      path: path
    })
  }

  @Listen("popstate", { target: "window" })
  async handleBackButton(event) {
    this.query = new Template.Query(this.connection, {
      path: event.state
    })
  }

  async componentWillRender() {
    this.connection = new Connection(this.global.context)
    this.query = new Template.Query(this.connection, {
      path: window.location.pathname 
    })
  }

  render() {
    if (!this.global.context) {
      return
    }
    const ThemeRoot = this.global.theme.root
    return (
      <ThemeRoot 
        theme={new Theme(this.connection, this.global.theme)} 
        query={this.query}
      />
    )
  }
}

