import WPAPI from "wpapi";

export interface ServerDefinition {
    apiUrl : string
}

export class WebpressConnection {
    constructor(readonly server : ServerDefinition) {

    }

    loadPost(_post : string) {
        // todo...
    }

    async getMenu(menu : string) : Promise<any> {
        var wp = new WPAPI({endpoint: this.server.apiUrl})
        WPAPI.prototype['menus'] = wp.registerRoute( 'wp-api-menus/v2', '/menus/(?P<id>)' );
        var menuLoaded = await wp.menus().id(menu).then(response => response);
        console.log(menuLoaded)
        return menuLoaded
    }
}