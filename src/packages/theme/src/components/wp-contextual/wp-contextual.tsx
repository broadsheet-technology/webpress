import { Component, Prop, Element, State, h } from '@stencil/core';
import { WebpressConnection, Query } from '@webpress/core';
import { WebpressContext, Theme } from '@webpress/core';
import { Template } from '@webpress/core';
import { TemplateQuery } from '@webpress/core';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  
  // json set externally by WordPress theme
  @Prop() context : WebpressContext;

  @Element() el: HTMLElement;
  
  @State() template : Template
  @State() query : TemplateQuery;

  async componentWillLoad() {
    if(this.template) {
      return
    }
    let connection = new WebpressConnection(this.context.server)

    this.query = new TemplateQuery(connection, window.location.pathname)
    this.template = await this.query.template
  }

  render() {
    if(!this.context) {
        return
    }
    const ThemeRoot = this.context.root
    return (
      <ThemeRoot 
        theme={new Theme(new WebpressConnection(this.context.server), this.context.theme)} 
        template={this.template}
      />
    )
  }

  componentDidLoad() {
    WebpressTheme.setQuery(Array.from(this.el.children), this.query)
  }

  private static setQuery(children : Array<any>, query : Query) {
    children.map(child => {
        if(!child.query) {
          /** If no query is set, propegate the global query */
          child.query = query
          WebpressTheme.setQuery(Array.from(child.children), query)
        } else {
          /** Otherwise, propegate the overridden query */
          WebpressTheme.setQuery(Array.from(child.children), child.query)
        }
    })
  }
}

