import { Component, Element, Prop, State, h } from '@stencil/core';
import { Connection, Query, Theme, Route, Media, LinkedQueryArgs } from '@webpress/core'
declare const exa: any

@Component({
    tag: 'wp-block-image-decorator',

    /**
     * z-index: makes caption selectable on floated images
     * width: resets block's given column width
     */
    styles: " \
    wp-block-image-decorator { \
      z-index: 1; \
      width: inherit; \
      display: inherit; \
    } \
    .media-byline { \
      display: block; \
    }"
})
export class WebpressBlockImageDecorator {
  @Prop() global: {
    // json set externally by index.php
    context: Connection.Context;
    theme: Theme.Definition;
  };

  @Element() el: HTMLElement;

  @State() id: number

  @State() media: Media
  private connection : Connection

  async componentWillLoad() {
    if (!this.connection) {
      this.connection = new Connection(this.global.context);
    }

    this.el.querySelector('img').classList.forEach(cls => {
      if (cls.startsWith("wp-image-")) {
        this.id = Number.parseInt(cls.substr(9),10)
      }
    })
  }

  async componentDidLoad() {
    if (this.id && !this.media) {
      try {
        this.media = await (new Query(this.connection, new LinkedQueryArgs(Media, new Route("media"), this.id))).result
      } catch {
        
      }
    }
  }

  render() {
    return <slot />
  }

  componentDidRender() {
    if (!this.media || !this.media.byline || !this.media.byline.author) {
      return
    }

    var caption = this.el.querySelector('figure')
    
    if (!caption) {
      return
    }

    let credit = document.createElement("span", {})
    credit.classList.add("byline")
    credit.append(this.media.byline.author)
    
    if (this.media.byline.creditLine) {
      let creditLine = document.createElement("span", {})
      creditLine.classList.add("creditline")
      creditLine.append(this.media.byline.creditLine)
      credit.append(creditLine)
    }

    caption.append(credit)
  }
}
 