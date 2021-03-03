import WPAPI from "wpapi";
import { Query } from "./Query";

export interface ServerDefinition {
    apiUrl : string
}

export class Route {
    constructor(readonly string) { }
}

export class Connection {
    readonly wp = new WPAPI({endpoint: this.server.apiUrl})
    constructor(private server : ServerDefinition) { }

    public request<T>(query: Query<T>) { 
        let request = routeToWPRequest(this.wp, query.args.route)
        let Constructor = query.args.type

        Object.keys(query.args.params).map( key => {
            request.param(key, query.args[key])
        })

        return request.then(result => result.map(json => new Constructor(query.connection, json)))
    }
}


function routeToWPRequest(wp : WPAPI, route: Route) : WPAPI.WPRequest {
    switch (route.string.toLowerCase()) {
        case "posts":
            return wp.posts()
        case "pages":
            return wp.pages()
        case "authors":
            return wp.users()
        case "media":
            return wp.media()
        case "template":
            wp.template = wp.registerRoute('webpress/v1', '/template/(?P<url>)');
            return wp.template()
    }
}