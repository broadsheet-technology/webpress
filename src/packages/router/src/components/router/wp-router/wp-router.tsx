import { Component, Element, h, Prop } from '@stencil/core'
import { TemplateContextual, Template, TemplateQuery, Single } from '@webpress/core'

@Component({
  tag: 'wp-router',
})
export class Router {
  @Element() el!: HTMLElement;
  @Prop() query : TemplateQuery<Single>

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
    
    let matchedTemplate = this.matchedTemplate
    matchedTemplate.query = this.query
    matchedTemplate.hidden = false
  }

  private get templateComponents() {
    return Array.from(this.el.children as unknown as TemplateContextual[])
  }

  private get matchedTemplate() {
    var highestScoredTemplateValue = Math.max.apply(Math, this.templateComponents.map(templateComponent => this.template.args.matchScore(templateComponent.args)))
    return this.templateComponents.find((templateComponent) => this.template.args.matchScore(templateComponent.args) == highestScoredTemplateValue)
  }
}