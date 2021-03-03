import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { Connection, WebpressContext, Theme, Single, TemplateQueryArgs, Query } from '@webpress/core';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  // json set externally by WordPress theme
  @Prop() context : WebpressContext

  @Element() el: HTMLElement
  
  @State() query : Promise<Single>

  private connection : Connection

  @Listen('webpressRouterNavigation') 
  async updateTemplate(event : any) {
    let path = event.detail.url
    window.history.pushState(path ,"here!!", path);

    let template = await new Query(this.connection, new TemplateQueryArgs(path)).result
    this.query = template.globalQuery
  }

  @Listen("popstate", { target: "window" })
  async handleBackButton(_event) {
   // let template = await (new TemplateQuery(this.query.connection, new TemplateQueryArgs(event.state)))
  //  this.query = template.globalQuery
  }

  async componentWillLoad() {
    this.connection = new Connection(this.context.server)
    return this.setTemplateByPagePath(window.location.pathname)
    //this.query = new TemplateQuery(connection, window.location.pathname)
  }

  private async setTemplateByPagePath(path) {
    let template = new Query(this.connection, new TemplateQueryArgs({
      path: path 
    })).result
    this.query = (await template).globalQuery
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

