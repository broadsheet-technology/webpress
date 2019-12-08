import { Component,  h, Prop, State } from '@stencil/core';
import { TemplateType, TemplateSingleType, TemplateFrontPageType } from '@webpress/router'
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
      this.mainMenu = await this.theme.getMenu('main')
    }
    console.log('here!')
    console.log(this.mainMenu)
  }

  render() {
    return (
      [
        <wp-broadsheet class="header">
          <header>
            <h1>Webpress</h1>
          </header>
          <wp-menu menu={this.mainMenu} />
        </wp-broadsheet>,
        <wp-router>
          { /* Homepage Templates */ }
          <wp-template args={ { type : TemplateType.FrontPage, frontPageType: TemplateFrontPageType.Page } } component="wp-front-page"></wp-template>
          <wp-template args={ { type : TemplateType.FrontPage, frontPageType: TemplateFrontPageType.Home } } component="wp-home"></wp-template>

          { /* Single Templates */ }
          <wp-template args={ { 
            type : TemplateType.Single,
            
          } } component="wp-post"></wp-template>
          <wp-template args={ { 
            type : TemplateType.Single,
            singleType: TemplateSingleType.Page 
          } }  component="wp-page"></wp-template>
          <wp-template args={ { type : TemplateType.PageNotFound} }  component="wp-404"></wp-template>
        </wp-router>
      ]
    )
  }
}
