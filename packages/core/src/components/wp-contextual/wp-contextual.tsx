import { Component, Prop, Element, h } from '@stencil/core';
import { WebpressConnection } from '../../connection';
import { WebpressContext, Theme } from '../../theme';

@Component({
    tag: 'webpress-theme',
})
export class WebpressTheme {
  @Prop() context : WebpressContext;
  @Prop() primaryMenu: number;

  @Element() el!: HTMLElement;

  theme : Theme
  connection : WebpressConnection

  componentWillLoad() {
    this.connection = new WebpressConnection(this.context.server)
  }

  render() {
    if(!this.context) {
        return
    }
    const ChildComponent = this.context.root
    return (
      <ChildComponent theme={new Theme(this.context.theme,this.connection)} />
    )
  }

  private static setConnection(children : Array<any>, connection : WebpressConnection) {
    children.map(child => {
        (child as unknown as any).connection = connection;
        WebpressTheme.setConnection(Array.from(child.children), connection)
    })
  }

  componentDidLoad() {
    WebpressTheme.setConnection(Array.from(this.el.children), this.connection)
  }

}

