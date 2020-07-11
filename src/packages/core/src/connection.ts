import WPAPI from "wpapi";
import { Template, Single, TemplateSingleType, Post } from ".";

export interface ServerDefinition {
    apiUrl : string
}

export class WebpressConnection {
    constructor(private server : ServerDefinition) {

    }

    loadPost(_post : string) {
        // todo...
    }

    async getMenu(menu : string) : Promise<any> {
        var wp = new WPAPI({endpoint: this.server.apiUrl})
        WPAPI.prototype['menus'] = wp.registerRoute( 'wp-api-menus/v2', '/menus/(?P<id>)' );
        var menuLoaded = await wp.menus().id(menu).then(response => response);
        return menuLoaded
    }

    private templatePromises = new Map<string,Promise<Template>>()

    async template(path : string) : Promise<Template> {
        if(this.templatePromises.has(path)) {
            return this.templatePromises.get(path)
        }

        this.templatePromises.set(path,new Promise(async (resolve) => {
            var wp = new WPAPI({endpoint: this.server.apiUrl})
            WPAPI.prototype['template'] = wp.registerRoute('webpress/v1', '/template/(?P<url>)');
        
            var templateLoader = wp.template()
            templateLoader.param("url", path)
        
            let json = await templateLoader.then(response => response).catch(error => resolve(error))

            this.templatePromises[path] = new Template(json)
            resolve(this.templatePromises[path])
        }))

        return this.templatePromises.get(path)
    }

    private postsPromises = new Map<Template,Promise<Single[]>>()

    async posts(template : Template) : Promise<Single[]> {
        if(this.postsPromises.has(template)) {
            return this.postsPromises.get(template)
        } 

        this.postsPromises.set(template,new Promise( async (resolve) => {
            var wp = new WPAPI({endpoint: this.server.apiUrl})

            if(template.args.singleType == TemplateSingleType.Page) {
                var postLoader = wp.pages()
            } else {
                var postLoader = wp.posts()
            }
            
            Object.keys(template.request).map( key => {
                postLoader.param(key, template.request[key])
            })            

            let json = await postLoader.then(response => response).catch(error => resolve(error))
            resolve(json.map(json => new Post(json)))
        }))

        return this.postsPromises.get(template)
    }

}