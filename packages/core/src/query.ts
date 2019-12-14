import { Single, Post } from "./post";
import { Template } from "./template";
import WPAPI from "wpapi";
import { WebpressConnection } from "./connection";

export class Query {
    protected loadedPosts : Single[]
    get posts() : Promise<Single[]> {
        return new Promise( (resolve) => resolve(this.loadedPosts) )
    }

    constructor(readonly connection : WebpressConnection) { }
}

export class TemplateQuery extends Query {
    loadedTemplate : Template
    get template() : Promise<Template> {
        return new Promise(async (resolve) => {
            var wp = new WPAPI({endpoint: this.connection.server.apiUrl})
            WPAPI.prototype['template'] = wp.registerRoute('webpress/v1', '/template/(?P<url>)');
        
            var templateLoader = wp.template()
            templateLoader.param("url", this.pagePath)
        
            let json = await templateLoader.then(response => response).catch(error => resolve(error))
            //this.loadedPosts = [...json.query.posts].map(json => new Post(json))
            this.loadedTemplate = new Template(json)
            resolve(this.loadedTemplate)
        })
    }

    get posts() : Promise<Single[]> {
        return new Promise( async (resolve) => {
            if(this.loadedPosts) {
                resolve(this.loadedPosts)
            }
            await this.template
            var wp = new WPAPI({endpoint: this.connection.server.apiUrl})

            var postLoader = wp.pages()

            Object.keys(this.loadedTemplate.request).map( key => {
                postLoader.param(key, this.loadedTemplate.request[key])
            })

            let json = await postLoader.then(response => response).catch(error => resolve(error))
            this.loadedPosts = json.map(json => new Post(json))
            console.log(this.loadedPosts)
            resolve(this.loadedPosts)
        })
    }

    constructor(connection : WebpressConnection, private pagePath : String) { 
        super(connection)
    }
}