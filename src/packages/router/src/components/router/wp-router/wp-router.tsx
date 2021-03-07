import { Component, Element, h, Prop } from '@stencil/core'
import { Template } from '@webpress/core'

@Component({
  tag: 'wp-router',
})
export class Router {
  @Element() el!: HTMLElement;
  @Prop() query : Template.Query

  private template : Template

  async componentWillLoad() {
    return this.componentWillUpdate()
  }

  async componentDidLoad() {
    this.template = await this.query.template
    return this.componentDidUpdate()
  }

  async componentWillUpdate() {
    this.template = await this.query.template
    this.templateComponents.map(templateComponent => {
      templateComponent.hidden = true
      templateComponent.query = undefined
    })
  }
  
  render() {
	  return this.query ? <slot /> : <div hidden={true} ><slot /></div>
  }
  
  async componentDidUpdate() {
    if(!this.query) {
      return
    }
    
    let matchedTemplate = Template.Resolve(this.template, this.templateComponents)
    matchedTemplate.query = this.query
    matchedTemplate.hidden = false
  }

  private get templateComponents() {
    return Array.from(this.el.children as unknown as Template.Contextual[])
  }

  
}