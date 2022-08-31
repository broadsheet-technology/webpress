import WPAPI from "wpapi";
import { QueryArgs } from "./Query";
import { Theme } from "./Theme";

export class Route {
  constructor(readonly string) {}
}

export class Connection {
  readonly wp = new WPAPI({ endpoint: this.serverInfo.apiUrl });
  constructor(private serverInfo: Connection.ServerInfo) {}

  public async request<T>(args: QueryArgs<T>) {
    let request = routeToWPRequest(this.wp, args.route);

    if (args.params.id && request.id) {
      request.id(args.params.id);
    } else {
      Object.keys(args.params).map((key) => {
        request.param(key, args.params[key]);
      });
    }

    let response = await request;
    return response;
  }
}

export namespace Connection {
  export interface Context {
    serverInfo: Connection.ServerInfo;
    theme: Theme.Definition;
  }
  export interface ServerInfo {
    apiUrl: string;
  }
}

const routeToWPRequest = (wp: WPAPI, route: Route): WPAPI.WPRequest => {
  switch (route.string.toLowerCase()) {
    case "post":
      return wp.posts();
    case "page":
      return wp.pages();
    case "author":
      return wp.users();
    case "media":
      return wp.media();
    case "search":
      return wp.search();
    case "template":
      wp.template = wp.registerRoute("webpress/v1", "/template/(?P<url>)");
      return wp.template();
    case "menu":
      wp.menu = wp.registerRoute("webpress/v1", "/menus/(?P<id>)");
      return wp.menu();
  }
};
