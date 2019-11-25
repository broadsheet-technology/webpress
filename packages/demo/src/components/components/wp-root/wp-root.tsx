import { Component,  h } from '@stencil/core';
import { TemplateType, TemplateSingleType } from '@webpress/router'

@Component({
  tag: 'wp-root',
  styleUrl: 'wp-root.scss',
})
export class Webpress {

  render() {
    return (
      <wp-router>
        <wp-template match={ { type : TemplateType.FrontPage } } component="wp-home"></wp-template>
        <wp-template match={ { 
          type : TemplateType.Single,
          singleType: TemplateSingleType.Post 
        } } component="wp-post"></wp-template>
        <wp-template match={ { 
          type : TemplateType.Single
        } }  component="wp-page"></wp-template>
        <wp-template match={ { type : TemplateType.PageNotFound} }  component="wp-404"></wp-template>
      </wp-router>

    )
  }
}
