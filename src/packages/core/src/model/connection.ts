import WPAPI from "wpapi";
import { QueryArgs } from "./Query";

export class Route {
    constructor(readonly string) { }
}

export class Connection {
    readonly wp = new WPAPI({endpoint: this.context.apiUrl})
    constructor(private context : Connection.Context) { }

    public async request<T>(args: QueryArgs<T>) { 
        let request = routeToWPRequest(this.wp, args.route)
        let Constructor = args.type

        if (args.params.id && request.id) {
            request.id(args.params.id)
        } else {
            Object.keys(args.params).map( key => {
                request.param(key, args.params[key])
            })
        }

        let json = await request
        var object

        if (args.params.id) {
            object = [new Constructor(this, json)]
        } else {
            object = json.map(objectJson => new Constructor(this, objectJson))
        }
        return object
    }
}

export namespace Connection {
    export interface Context {
        apiUrl : string
    }
}

const routeToWPRequest = (wp : WPAPI, route: Route) : WPAPI.WPRequest => {
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
            case "menu":
                wp.menu = wp.registerRoute('wp-api-menus/v2', '/menus/(?P<id>)');
                return wp.menu()
        }
    }