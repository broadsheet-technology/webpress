import { Single } from "./post";
import { Template } from "./template";
import { WebpressConnection } from "./connection";

export class Query {
    protected loadedPosts : Single[]
    get posts() : Promise<Single[]> {
        return new Promise( (resolve) => resolve(this.loadedPosts) )
    }

    constructor(readonly connection : WebpressConnection) { }
}

export class TemplateQuery extends Query {

    get template() : Promise<Template> {
        return this.connection.template(this.pagePath)
    }

    get posts() : Promise<Single[]> {
        return new Promise( async (resolve) => {
            const template = await this.template
            resolve(this.connection.posts(template))
        })
    }

    constructor(connection : WebpressConnection, private pagePath : string) { 
        super(connection)
    }
}