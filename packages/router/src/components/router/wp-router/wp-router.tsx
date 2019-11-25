import { Component, State, Element, h } from '@stencil/core';
import { RouteMatch, RouteFactory, Template, TemplateFactory, TemplateContextual, WPRoute } from '../../../global/index';
import WPAPI from 'wpapi';

declare const exa : any 

@Component({
  tag: 'wp-router',
})
export class Router {

  @State() foundRoutes : RouteMatch[]
  @State() path : string = ""

  @State() template : Template

  @Element() el!: HTMLElement;

  private routeMap : WeakMap<WPRoute,RouteMatch> = new WeakMap<WPRoute,RouteMatch>()

  async componentWillLoad() {
    var routeFactory = new RouteFactory(this.wordpressRoutes())
    const path = window.location.pathname
    this.foundRoutes = routeFactory.routesForPath(path)

    var wp = new WPAPI({endpoint: exa.api_url})
    WPAPI.prototype['route'] = wp.registerRoute( 'webpress/v1', '/route/(?P<id>)' );

    var routes = await Promise.all(routeFactory.bestMatches(this.foundRoutes).map((match,_,all) => {
      const loader = wp.route()
      match.params.forEach((value,key) => {
        loader.param(key,value)
      })
      if(all.length > 1) {
        loader.param("resolve",true);
      }

      return loader.then(route => {this.routeMap.set(route,match); return route })
    }))

    if(routes.length === 0) {
      this.template = TemplateFactory.templateFromRoute(undefined)
    } else if(routes.length === 1) {
      this.template = TemplateFactory.templateFromRoute(routes[0])
    } else {
      const index = routes.findIndex(route => !route.query.is_404)
      if(index == -1 ) {
        this.template =  TemplateFactory.templateFromRoute(undefined)
      } else {
        this.template = TemplateFactory.templateFromRoute(routes[index])
      }
    }

    return
  }

  render() {
    var templates = Array.from(this.el.children as unknown as TemplateContextual[])
    templates.map( template => {
      template.query = this.template.query
    })
    
    var highestScoredTemplateValue = Math.max.apply(Math, templates.map( template => this.template.matchScore(template.match)))
    templates.map( template => {
      if(this.template.matchScore(template.match) == highestScoredTemplateValue) {
        template.hidden = false;
      } else {
        template.query = this.template.query
        template.hidden = true;
      }
    })

	  return <slot />
  }

  componentDidLoad() {
    var templates = Array.from(this.el.children as unknown as TemplateContextual[])
    var highestScoredTemplateValue = Math.max.apply(Math, templates.map( template => this.template.matchScore(template.match)))
    templates.map( template => {
      if(this.template.matchScore(template.match) == highestScoredTemplateValue) {
        template.hidden = false;
      } else {
        template.query = this.template.query
        template.hidden = true;
      }
    })

  }

  private wordpressRoutes() {
    const routes =  new Map<string,string>()
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&page=$matches[6]")
    routes.set("shoutouts/so/([^/]+)/?$", "index.php?pagename=shoutouts&so_num=$matches[1]")
    routes.set("shoutouts/page/([^/]+)/?$", "index.php?pagename=shoutouts&so_page=$matches[1]")

    routes.set("^editors-pick.rss$", "index.php?wpseo-news-editors-pick=all")

    routes.set("masthead/?$", "index.php?post_type=exa_masthead")
    routes.set("masthead/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?post_type=exa_masthead&feed=$matches[1]")
    routes.set("masthead/(feed|rdf|rss|rss2|atom)/?$", "index.php?post_type=exa_masthead&feed=$matches[1]")
    routes.set("masthead/page/([0-9]{1,})/?$", "index.php?post_type=exa_masthead&paged=$matches[1]")

    routes.set("sitemap_index\.xml$", "index.php?sitemap=1")
    routes.set("([^/]+?)-sitemap([0-9]+)?\.xml$", "index.php?sitemap=$matches[1]&sitemap_n=$matches[2]")

    routes.set("([a-z]+)?-?sitemap\.xsl$", "index.php?xsl=$matches[1]")

    routes.set("^wp-json/?$", "index.php?rest_route=/")
    routes.set("^wp-json/(.*)?", "index.php?rest_route=/$matches[1]")
    routes.set("^index.php/wp-json/?$", "index.php?rest_route=/")
    routes.set("^index.php/wp-json/(.*)?", "index.php?rest_route=/$matches[1]")

    routes.set("([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&page=$matches[5]")

    routes.set("^news-sitemap.xsl$", "index.php?xsl=news")

    routes.set("./(.+?)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&feed=$matches[2]")
    routes.set("./(.+?)/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&feed=$matches[2]")
    routes.set("./(.+?)/embed/?$", "index.php?category_name=$matches[1]&embed=true")
    routes.set("./(.+?)/page/?([0-9]{1,})/?$", "index.php?category_name=$matches[1]&paged=$matches[2]")
    routes.set("./(.+?)/?$", "index.php?category_name=$matches[1]")

    routes.set("tag/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?tag=$matches[1]&feed=$matches[2]")
    routes.set("tag/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?tag=$matches[1]&feed=$matches[2]")
    routes.set("tag/([^/]+)/embed/?$", "index.php?tag=$matches[1]&embed=true")
    routes.set("tag/([^/]+)/page/?([0-9]{1,})/?$", "index.php?tag=$matches[1]&paged=$matches[2]")
    routes.set("tag/([^/]+)/?$", "index.php?tag=$matches[1]")

    routes.set("type/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?post_format=$matches[1]&feed=$matches[2]")
    routes.set("type/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?post_format=$matches[1]&feed=$matches[2]")
    routes.set("type/([^/]+)/embed/?$", "index.php?post_format=$matches[1]&embed=true")
    routes.set("type/([^/]+)/page/?([0-9]{1,})/?$", "index.php?post_format=$matches[1]&paged=$matches[2]")
    routes.set("type/([^/]+)/?$", "index.php?post_format=$matches[1]")

    routes.set("yst_prominent_words/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?yst_prominent_words=$matches[1]&feed=$matches[2]")
    routes.set("yst_prominent_words/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?yst_prominent_words=$matches[1]&feed=$matches[2]")
    routes.set("yst_prominent_words/([^/]+)/embed/?$", "index.php?yst_prominent_words=$matches[1]&embed=true")
    routes.set("yst_prominent_words/([^/]+)/page/?([0-9]{1,})/?$", "index.php?yst_prominent_words=$matches[1]&paged=$matches[2]")
    routes.set("yst_prominent_words/([^/]+)/?$", "index.php?yst_prominent_words=$matches[1]")

    routes.set("exa_layout/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?exa_layout=$matches[1]&feed=$matches[2]")
    routes.set("exa_layout/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?exa_layout=$matches[1]&feed=$matches[2]")
    routes.set("exa_layout/([^/]+)/embed/?$", "index.php?exa_layout=$matches[1]&embed=true")
    routes.set("exa_layout/([^/]+)/page/?([0-9]{1,})/?$", "index.php?exa_layout=$matches[1]&paged=$matches[2]")
    routes.set("exa_layout/([^/]+)/?$", "index.php?exa_layout=$matches[1]")

    routes.set("masthead/[^/]+/attachment/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set("masthead/[^/]+/attachment/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set("masthead/[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("masthead/[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("masthead/[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set("masthead/[^/]+/attachment/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")

    routes.set("masthead/([^/]+)/embed/?$", "index.php?exa_masthead=$matches[1]&embed=true")
    routes.set("masthead/([^/]+)/trackback/?$", "index.php?exa_masthead=$matches[1]&tb=1")
    routes.set("masthead/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?exa_masthead=$matches[1]&feed=$matches[2]")
    routes.set("masthead/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?exa_masthead=$matches[1]&feed=$matches[2]")
    routes.set("masthead/([^/]+)/page/?([0-9]{1,})/?$", "index.php?exa_masthead=$matches[1]&paged=$matches[2]")
    routes.set("masthead/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?exa_masthead=$matches[1]&cpage=$matches[2]")
    routes.set("masthead/([^/]+)(?:/([0-9]+))?/?$", "index.php?exa_masthead=$matches[1]&page=$matches[2]")

    routes.set("masthead/[^/]+/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set("masthead/[^/]+/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set("masthead/[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("masthead/[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("masthead/[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set("masthead/[^/]+/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")
    routes.set("mc4wp-form/[^/]+/attachment/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set("mc4wp-form/[^/]+/attachment/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set("mc4wp-form/[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("mc4wp-form/[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("mc4wp-form/[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set("mc4wp-form/[^/]+/attachment/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")

    routes.set("mc4wp-form/([^/]+)/embed/?$", "index.php?mc4wp-form=$matches[1]&embed=true")
    routes.set("mc4wp-form/([^/]+)/trackback/?$", "index.php?mc4wp-form=$matches[1]&tb=1")
    routes.set("mc4wp-form/([^/]+)/page/?([0-9]{1,})/?$", "index.php?mc4wp-form=$matches[1]&paged=$matches[2]")
    routes.set("mc4wp-form/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?mc4wp-form=$matches[1]&cpage=$matches[2]")
    routes.set("mc4wp-form/([^/]+)(?:/([0-9]+))?/?$", "index.php?mc4wp-form=$matches[1]&page=$matches[2]")

    routes.set("mc4wp-form/[^/]+/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set("mc4wp-form/[^/]+/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set("mc4wp-form/[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("mc4wp-form/[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set("mc4wp-form/[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set("mc4wp-form/[^/]+/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")

    routes.set("topic/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?topic=$matches[1]&feed=$matches[2]")
    routes.set("topic/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?topic=$matches[1]&feed=$matches[2]")
    routes.set("topic/([^/]+)/embed/?$", "index.php?topic=$matches[1]&embed=true")
    routes.set("topic/([^/]+)/page/?([0-9]{1,})/?$", "index.php?topic=$matches[1]&paged=$matches[2]")
    routes.set("topic/([^/]+)/?$", "index.php?topic=$matches[1]")

    routes.set("importance/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?importance=$matches[1]&feed=$matches[2]")
    routes.set("importance/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?importance=$matches[1]&feed=$matches[2]")
    routes.set("importance/([^/]+)/embed/?$", "index.php?importance=$matches[1]&embed=true")
    routes.set("importance/([^/]+)/page/?([0-9]{1,})/?$", "index.php?importance=$matches[1]&paged=$matches[2]")
    routes.set("importance/([^/]+)/?$", "index.php?importance=$matches[1]")

    routes.set("robots\.txt$", "index.php?robots=1")

    routes.set(".*wp-(atom|rdf|rss|rss2|feed|commentsrss2)\.php$", "index.php?feed=old")

    routes.set(".*wp-app\.php(/.*)?$", "index.php?error=403")

    routes.set(".*wp-register.php$", "index.php?register=true")

    routes.set("feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?&feed=$matches[1]")
    routes.set("(feed|rdf|rss|rss2|atom)/?$", "index.php?&feed=$matches[1]")

    routes.set("embed/?$", "index.php?&embed=true")

    routes.set("page/?([0-9]{1,})/?$", "index.php?&paged=$matches[1]")

    routes.set("comments/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?&feed=$matches[1]&withcomments=1")
    routes.set("comments/(feed|rdf|rss|rss2|atom)/?$", "index.php?&feed=$matches[1]&withcomments=1")

    routes.set("comments/embed/?$", "index.php?&embed=true")

    routes.set("search/(.+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?s=$matches[1]&feed=$matches[2]")
    routes.set("search/(.+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?s=$matches[1]&feed=$matches[2]")
    routes.set("search/(.+)/embed/?$", "index.php?s=$matches[1]&embed=true")
    routes.set("search/(.+)/page/?([0-9]{1,})/?$", "index.php?s=$matches[1]&paged=$matches[2]")
    routes.set("search/(.+)/?$", "index.php?s=$matches[1]")

    routes.set("author/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?author_name=$matches[1]&feed=$matches[2]")
    routes.set("author/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?author_name=$matches[1]&feed=$matches[2]")
    routes.set("author/([^/]+)/embed/?$", "index.php?author_name=$matches[1]&embed=true")
    routes.set("author/([^/]+)/page/?([0-9]{1,})/?$", "index.php?author_name=$matches[1]&paged=$matches[2]")
    routes.set("author/([^/]+)/?$", "index.php?author_name=$matches[1]")

    routes.set("([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]")
    routes.set("([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]")
    routes.set("([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/embed/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&embed=true")
    routes.set("([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/page/?([0-9]{1,})/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&paged=$matches[4]")
    routes.set("([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]")
    routes.set("([0-9]{4})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]")
    routes.set("([0-9]{4})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]")
    routes.set("([0-9]{4})/([0-9]{1,2})/embed/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&embed=true")
    routes.set("([0-9]{4})/([0-9]{1,2})/page/?([0-9]{1,})/?$", "index.php?year=$matches[1]&monthnum=$matches[2]&paged=$matches[3]")
    routes.set("([0-9]{4})/([0-9]{1,2})/?$", "index.php?year=$matches[1]&monthnum=$matches[2]")
    routes.set("([0-9]{4})/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?year=$matches[1]&feed=$matches[2]")
    routes.set("([0-9]{4})/(feed|rdf|rss|rss2|atom)/?$", "index.php?year=$matches[1]&feed=$matches[2]")
    routes.set("([0-9]{4})/embed/?$", "index.php?year=$matches[1]&embed=true")
    routes.set("([0-9]{4})/page/?([0-9]{1,})/?$", "index.php?year=$matches[1]&paged=$matches[2]")
    routes.set("([0-9]{4})/?$", "index.php?year=$matches[1]")

    routes.set(".?.+?/attachment/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set(".?.+?/attachment/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set(".?.+?/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set(".?.+?/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set(".?.+?/attachment/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set(".?.+?/attachment/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")

    routes.set("(.?.+?)/embed/?$", "index.php?pagename=$matches[1]&embed=true")
    routes.set("(.?.+?)/trackback/?$", "index.php?pagename=$matches[1]&tb=1")
    routes.set("(.?.+?)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?pagename=$matches[1]&feed=$matches[2]")
    routes.set("(.?.+?)/(feed|rdf|rss|rss2|atom)/?$", "index.php?pagename=$matches[1]&feed=$matches[2]")
    routes.set("(.?.+?)/page/?([0-9]{1,})/?$", "index.php?pagename=$matches[1]&paged=$matches[2]")
    routes.set("(.?.+?)/comment-page-([0-9]{1,})/?$", "index.php?pagename=$matches[1]&cpage=$matches[2]")
    routes.set("(.?.+?)(?:/([0-9]+))?/?$", "index.php?pagename=$matches[1]&page=$matches[2]")

    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")

    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/embed/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&embed=true")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/trackback/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&tb=1")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&feed=$matches[6]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&feed=$matches[6]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/page/?([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&paged=$matches[6]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&cpage=$matches[6]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&name=$matches[5]&page=$matches[6]")

    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/?$", "index.php?attachment=$matches[1]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/trackback/?$", "index.php?attachment=$matches[1]&tb=1")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$", "index.php?attachment=$matches[1]&feed=$matches[2]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$", "index.php?attachment=$matches[1]&cpage=$matches[2]")
    routes.set(".+?/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/embed/?$", "index.php?attachment=$matches[1]&embed=true")

    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&feed=$matches[5]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&feed=$matches[5]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/embed/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&embed=true")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/page/?([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&paged=$matches[5]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/comment-page-([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]&cpage=$matches[5]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&day=$matches[4]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&feed=$matches[4]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&feed=$matches[4]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/embed/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&embed=true")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/page/?([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&paged=$matches[4]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/comment-page-([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]&cpage=$matches[4]")
    routes.set("(.+?)/([0-9]{4})/([0-9]{1,2})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&monthnum=$matches[3]")
    routes.set("(.+?)/([0-9]{4})/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&feed=$matches[3]")
    routes.set("(.+?)/([0-9]{4})/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&year=$matches[2]&feed=$matches[3]")
    routes.set("(.+?)/([0-9]{4})/embed/?$", "index.php?category_name=$matches[1]&year=$matches[2]&embed=true")
    routes.set("(.+?)/([0-9]{4})/page/?([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&paged=$matches[3]")
    routes.set("(.+?)/([0-9]{4})/comment-page-([0-9]{1,})/?$", "index.php?category_name=$matches[1]&year=$matches[2]&cpage=$matches[3]")
    routes.set("(.+?)/([0-9]{4})/?$", "index.php?category_name=$matches[1]&year=$matches[2]")
    routes.set("(.+?)/feed/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&feed=$matches[2]")
    routes.set("(.+?)/(feed|rdf|rss|rss2|atom)/?$", "index.php?category_name=$matches[1]&feed=$matches[2]")
    routes.set("(.+?)/embed/?$", "index.php?category_name=$matches[1]&embed=true")
    routes.set("(.+?)/page/?([0-9]{1,})/?$", "index.php?category_name=$matches[1]&paged=$matches[2]")
    routes.set("(.+?)/comment-page-([0-9]{1,})/?$", "index.php?category_name=$matches[1]&cpage=$matches[2]")
    routes.set("(.+?)/?$", "index.php?category_name=$matches[1]")
    return routes;
  }


}

