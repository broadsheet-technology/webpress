import WPAPI from "wpapi";
import { QueryArgs } from "./Query";

export interface ServerDefinition {
    apiUrl : string
}

export class Route {
    constructor(readonly string) { }
}

export class Connection {
    readonly wp = new WPAPI({endpoint: this.server.apiUrl})
    constructor(private server : ServerDefinition) { }

    public async request<T>(args: QueryArgs<T>) { 
        let request = routeToWPRequest(this.wp, args.route)
        let Constructor = args.type

        Object.keys(args.params).map( key => {
            request.param(key, args[key])
        })

        let json = await request
        let object = json.map(objectJson => new Constructor(this, objectJson))
        return object
    }
}


function routeToWPRequest(wp : WPAPI, route: Route) : WPAPI.WPRequest {
    console.group(route)
    switch (route.string.toLowerCase()) {
        case "post":
            return wp.posts()
        case "page":
            return wp.pages()
        case "author":
            return wp.users()
        case "media":
            return wp.media()
        case "template":
            wp.template = wp.registerRoute('webpress/v1', '/template/(?P<url>)');
            return wp.template()
    }
}