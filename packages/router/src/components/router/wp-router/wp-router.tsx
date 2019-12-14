import { Component, Element, h, Prop } from '@stencil/core'
import { TemplateQuery, TemplateContextual } from '@webpress/core'

@Component({
  tag: 'wp-router',
})
export class Router {
  @Element() el!: HTMLElement;

  @Prop() query : TemplateQuery

  render() {
	  return this.query ? <slot /> : <div hidden={true} ><slot /></div>
  }

  async componentDidRender() {
    if(!this.query) {
      return
    }
    let template = await this.query.template
    var templateComponents = Array.from(this.el.children as unknown as TemplateContextual[])
    var highestScoredTemplateValue = Math.max.apply(Math, templateComponents.map(templateComponent => template.args.matchScore(templateComponent.args)))
    templateComponents.map(templateComponent => {
      templateComponent.hidden = template.args.matchScore(templateComponent.args) !== highestScoredTemplateValue;
      templateComponent.query = this.query
    })
  }
}