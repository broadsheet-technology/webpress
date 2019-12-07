import { Component,  h, Prop, State } from '@stencil/core';
import { TemplateType, TemplateSingleType } from '@webpress/router'
import { Theme, Menu } from '@webpress/core'

@Component({
  tag: 'wp-root',
  styleUrl: 'wp-root.scss',
})
export class Webpress {

  @Prop() theme : Theme

  @State() mainMenu : Menu

  async componentWillRender() {
    if(!this.mainMenu && this.theme) {
      console.log('also here!')
      this.mainMenu = await this.theme.getMenu('Main')
    }
    console.log('here!')
    console.log(this.mainMenu)
  }

  render() {
    return (
      [
      <wp-menu menu={this.mainMenu} />,
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
      ]
    )
  }
}
