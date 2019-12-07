import { Component, Prop, h } from '@stencil/core';
import { WebpressConnection } from '../../connection';
import { WebpressContext } from '../../theme';

@Component({
    tag: 'webpress-theme',
})
export class WebpressContextual {
  @Prop() context : WebpressContext

  dataStore : WebpressConnection

  componentWillLoad() {
    this.dataStore = new WebpressConnection(this.context.server)
  }

  render() {
    const ChildComponent = this.context.root
    return (
      <ChildComponent theme={this.context.theme} />
    )
  }
}

