import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { WebpressConnection } from '../../index';
import { WebpressContext, Theme } from '../../theme';
import { Template } from '../../template';
import { TemplateQuery } from '../../query';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  
  // json set externally in index.php
  @Prop() context : WebpressContext;

  @Listen('webpressNavigation') 
  async function(event : any) {
    let path = event.detail.url
    window.history.pushState(path ,"!!", path);

    this.template = await this.query.template
    this.query = new TemplateQuery(this.connection, path)
  }

  @Element() el!: HTMLElement;
  
  @State() template : Template
  @State() query : TemplateQuery;

  connection : WebpressConnection

  async componentWillLoad() {
    if(this.template || this.connection) {
      return; 
    }

    this.connection = new WebpressConnection(this.context.server)
    this.query = new TemplateQuery(this.connection, window.location.pathname)
    this.template = await this.query.template
  }

  render() {
    if(!this.context) {
        console.log("No Context Set!")
        return
    }
    console.log("Loading webpress...")
    const ThemeRoot = this.context.root
    return (
      <ThemeRoot 
        theme={new Theme(new WebpressConnection(this.context.server), this.context.theme)} 
        query={this.query}
      />
    )
  }

  componentDidLoad() {
    WebpressTheme.setConnection(Array.from(this.el.children), this.template)
  }

  private static setConnection(children : Array<any>, template : Template) {
    children.map(child => {
        (child as unknown as any).template = template;
        WebpressTheme.setConnection(Array.from(child.children), template)
    })
  }
}

