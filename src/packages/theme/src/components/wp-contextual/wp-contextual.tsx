import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { WebpressConnection, WebpressContext, TemplateQuery, Theme } from '@webpress/core';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  
  // json set externally by WordPress theme
  @Prop() context : WebpressContext;

  @Element() el: HTMLElement;
  
  @State() query : TemplateQuery;

  @Listen('webpressRouterNavigation') 
  async updateTemplate(event : any) {
    let path = event.detail.url
    window.history.pushState(path ,"here!!", path);
    this.query = new TemplateQuery(this.query.connection, path)
  }

  @Listen("popstate", { target: "window" })
  handleBackButton(event) {
    this.query = new TemplateQuery(this.query.connection, event.state) 
  }

  async componentWillLoad() {
    let connection = new WebpressConnection(this.context.server)
    this.query = new TemplateQuery(connection, window.location.pathname)
  }

  render() {
    if(!this.context) {
      return
    }
    const ThemeRoot = this.context.root
    return (
      <ThemeRoot 
        theme={new Theme(new WebpressConnection(this.context.server), this.context.theme)} 
        query={this.query}
      />
    )
  }

/*
  componentDidRender() {
    WebpressTheme.setQuery(Array.from(this.el.children), this.query)
  }

  private static setQuery(children : Array<any>, query : Query) {
    children.map(child => {
      if(!child.query) {
        /// If no query is set, propegate the global query
        child.query = query
        WebpressTheme.setQuery(Array.from(child.children), query)
      } else {
        /// Otherwise, propegate the overridden query
        WebpressTheme.setQuery(Array.from(child.children), child.query)
      }
    })
  }
*/

}

