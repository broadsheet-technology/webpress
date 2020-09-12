import { Component, Prop, Event, EventEmitter, h } from '@stencil/core'
import { Single, MenuItem } from '@webpress/core'

@Component({
    tag: 'wp-link',
})
export class WebpressTheme {
  @Prop() object : Single | MenuItem;

  @Prop() path : string;

  @Event() webpressNavigation: EventEmitter<{ url }>;

  anchor

  render() {
    console.log("thing",this.object,this.path)
    return (
      <a ref={ref => this.anchor = ref } href={this.object ? this.object.link : this.path}>
        <slot />
      </a>
    )
  }

}

