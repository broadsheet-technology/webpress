import { Component, State, Element, h, Prop } from '@stencil/core'
import { WebpressConnection, Query } from '@webpress/core'
import { Template, TemplateContextual } from '../../../global/index'
import WPAPI from 'wpapi'

@Component({
  tag: 'wp-router',
})
export class Router {
  @Prop() connection : WebpressConnection

  @State() path : string = ""
  @State() template : Template

  @Element() el!: HTMLElement;

  async componentWillUpdate() {
    if(this.template || !this.connection) {
      return;
    }

    var wp = new WPAPI({endpoint: this.connection.server.apiUrl})
    WPAPI.prototype['template'] = wp.registerRoute('webpress/v1', '/template/(?P<url>)');

    var templateLoader = wp.template()
    templateLoader.param("url", window.location.pathname)

    this.template = await templateLoader.then(response => new Template(response))
  }

  render() {
	  return this.template ? <slot /> : <div hidden={true} ><slot /></div>
  }

  componentDidUpdate() {
    if(!this.template) {
      return
    }
    var templateComponents = Array.from(this.el.children as unknown as TemplateContextual[])
    var highestScoredTemplateValue = Math.max.apply(Math, templateComponents.map(template => this.template.args.matchScore(template.args)))
    templateComponents.map(templateComponent => {
      templateComponent.hidden = this.template.args.matchScore(templateComponent.args) !== highestScoredTemplateValue;
      templateComponent.query = new Query(this.connection, this.template.query)
    })
  }
}