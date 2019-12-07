import { Component,  h, Prop } from '@stencil/core';
import { TemplateType, TemplateSingleType } from '@webpress/router'
import { ThemeDefinition } from '@webpress/core'

@Component({
  tag: 'wp-root',
  styleUrl: 'wp-root.scss',
})
export class Webpress {

  @Prop() theme : ThemeDefinition

  render() {
    return (
      <wp-router>
        <wp-template args={ { type : TemplateType.FrontPage } } component="wp-home"></wp-template>
        <wp-template args={ { 
          type : TemplateType.Single,
          singleType: TemplateSingleType.Post 
        } } component="wp-post"></wp-template>
        <wp-template args={ { 
          type : TemplateType.Single
        } }  component="wp-page"></wp-template>
        <wp-template args={ { type : TemplateType.PageNotFound} }  component="wp-404"></wp-template>
      </wp-router>
    )
  }
}
