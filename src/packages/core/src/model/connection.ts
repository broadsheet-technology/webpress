import WPAPI from "wpapi";
import { Template, Single, TemplateSingleType, Post, AuthorQuery, Author, SingleQuery, WebpressQuery, WebpressObject } from "..";
import { MediaQuery, Media } from "./media";
import { Menu } from "./menu";

export type Retrievable<T> = { new (...args: any[]): T; };

export interface ServerDefinition {
    apiUrl : string
}

export class WebpressConnection {
    constructor(private server : ServerDefinition) {

    }

    loadPost(_post : string) {
        // todo...
    }

    async get<T extends WebpressObject>(route: string, query: WebpressQuery<T>) : Promise<T> {
        let wp = new WPAPI({endpoint: this.server.apiUrl})
        let req = this.request(route,wp)
        if(query.args && query.args.id) {
            req.id(query.args.id)
        }
        let json = await req.then(json => json)
        let record = new query.type(json)
        return record
    }

    async getMulti<T extends WebpressObject>(route: string, query: WebpressQuery<T>) : Promise<T[]> {
        let wp = new WPAPI({endpoint: this.server.apiUrl})
        let req = this.request(route,wp)
        if(query.args && query.args.id) {
            req.id(query.args.id)
        }
        let json = await req.then(json => json)
        let records = json.map(json => new query.type(json))
        return records
    } 

    private request(route: string, wp : WPAPI) {
        switch (route) {
            case "Posts":
                return wp.posts()
            case "pages":
                return wp.pages()
            case "Authors":
                return wp.users()
            case "Media":
                return wp.media()
        }
    }

    async getMenu(menu : string) : Promise<any> {
        var wp = new WPAPI({endpoint: this.server.apiUrl})
        WPAPI.prototype['menus'] = wp.registerRoute( 'wp-api-menus/v2', '/menus/(?P<id>)' );
        var menuLoaded = await wp.menus().id(menu).then(response => response);
        return new Menu(menuLoaded)
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
        if (this.postsPromises.has(template)) {
            return this.postsPromises.get(template)
        } 

        this.postsPromises.set(template,new Promise( async (resolve) => {
            var wp = new WPAPI({endpoint: this.server.apiUrl})

            if (template.args.singleType == TemplateSingleType.Page) {
                var postLoader = wp.pages()
            } else {
                var postLoader = wp.posts()
            }
            
            Object.keys(template.request).map( key => {
                postLoader.param(key, template.request[key])
            })            

            let json = await postLoader.then(response => response).catch(error => resolve(error))
            resolve(json.map(json => new Post(json, this)))
        }))

        return this.postsPromises.get(template)
    }

    private singleStore = new Map<SingleQuery,Promise<Single[]>>()

    async single(query : SingleQuery) : Promise<Single[]> {
        if (this.singleStore.has(query)) {
            return this.singleStore.get(query)
        } 

        this.singleStore.set(query,new Promise( async (resolve) => {
            var wp = new WPAPI({endpoint: this.server.apiUrl})

            if (query.singleType == TemplateSingleType.Page) {
                var postLoader = wp.pages()
            } else {
                var postLoader = wp.posts()
            }
            
            if (query.slug) {
                postLoader.slug(query.slug)
            }        

            let json = await postLoader.then(response => response).catch(error => resolve(error))
            resolve(json.map(json => new Post(json, this)))
        }))

        return this.singleStore.get(query)
    }

    private mediaStore = new Map<MediaQuery,Promise<Media[]>>()

    async media(query : MediaQuery) : Promise<Media[]> {
        if(!query.id) {
            return []
        }
        if(this.mediaStore.has(query)) {
            return this.mediaStore.get(query)
        }

        this.mediaStore.set(query,new Promise( async (resolve) => {
            var wp = new WPAPI({endpoint: this.server.apiUrl})
            let json = await wp.media().id(query.id)
            resolve([new Media(json)])
        }))

        return this.mediaStore.get(query)
    }

    private authorStore = new Map<AuthorQuery,Promise<Author[]>>()

    async authors(query : AuthorQuery) : Promise<Author[]> {
        if(this.authorStore.has(query)) {
            return this.authorStore.get(query)
        }

        this.authorStore.set(query,new Promise( async (resolve) => {
            var wp = new WPAPI({endpoint: this.server.apiUrl})
            let json = await wp.users().id(query.id)
            resolve([new Author(json)])
        }))

        return this.authorStore.get(query)
    }
}