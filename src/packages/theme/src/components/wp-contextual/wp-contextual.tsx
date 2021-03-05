import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { Connection, WebpressContext, Theme, TemplateQueryArgs, Query, TemplateQuery, Single } from '@webpress/core';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  @Prop() context : WebpressContext   // json set externally by WordPress theme

  @Element() el: HTMLElement
  @State() query : TemplateQuery<Single>
  private connection : Connection

  @Listen('webpressRouterNavigation') 
  async updateTemplate(event : any) {
    let path = event.detail.url
    window.history.pushState(path ,"here!!", path);
    this.query = templateQueryForPath(path, this.connection)
  }

  @Listen("popstate", { target: "window" })
  async handleBackButton(event) {
    this.query = templateQueryForPath(event.state, this.connection)
  }

  async componentWillLoad() {
    this.connection = new Connection(this.context.server)
    this.query = templateQueryForPath(window.location.pathname, this.connection)
  }

  render() {
    if(!this.context) {
      return
    }
    const ThemeRoot = this.context.root
    return (
      <ThemeRoot 
        theme={new Theme(new Connection(this.context.server), this.context.theme)} 
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


//
// Creates a Query<Template> from a URL path string (e.g. window.location.path)
//
function templateQueryForPath(path : string, connection : Connection) : TemplateQuery<Single> {
  return new TemplateQuery<Single>(connection, new TemplateQueryArgs({
    path: path 
  }))
}

