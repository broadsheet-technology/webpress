import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { Connection, Theme, Query, Template, Single } from '@webpress/core';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  @Prop() global: {
    context: Connection.Context,
    theme: Theme.Definition
  } // json set externally by WordPress theme

  @Element() el: HTMLElement
  @State() query : Template.Query<Single>
  private connection : Connection

  @Listen('webpressRouterNavigation') 
  async updateTemplate(event : any) {
    let path = event.detail.url
    window.history.pushState(path ,"here!!", path);
    this.query = new Template.Query<Single>(this.connection, {
      path: path
    })
  }

  @Listen("popstate", { target: "window" })
  async handleBackButton(event) {
    this.query = new Template.Query<Single>(this.connection, {
      path: event.state
    })
  }

  async componentWillLoad() {
    this.connection = new Connection(this.global.context)
    this.query = new Template.Query<Single>(this.connection, {
      path: window.location.pathname 
    })
  }

  render() {
    if(!this.global.context) {
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

  componentDidRender() {
    propagateQuery(Array.from(this.el.children), this.query)
  }
}

//
// Sets .query on all children elements recursively
//
// Warnings:
//   - Heavy handed. Ideally refactored to deliver queries only active elements, and elements expecting/subscribed to a query.
//
const propagateQuery = (children : Array<any>, query : Query<any>) => children.map(child => {
    if(!child.query) {
      /// If no query is set, propegate the global query
      child.query = query
      propagateQuery(Array.from(child.children), query)
    } else {
      /// Otherwise, propegate the overridden query
      propagateQuery(Array.from(child.children), child.query)
    }
  })

