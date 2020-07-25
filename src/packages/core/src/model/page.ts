import { Single } from "./single"
import { WebpressConnection } from "./connection"

export class Page extends Single {
    readonly route = "page"
    constructor(json: any, connection: WebpressConnection) { 
        super(json, connection)
    }
    /*
    static fromList(posts : any) {
        return posts.map(post => {return new Post(post)})
    }
    */
}
