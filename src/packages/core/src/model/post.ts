import { Single } from './single'
import { WebpressConnection } from './connection';

export class Post extends Single {
    readonly route = "post"
    constructor(json: any, connection: WebpressConnection) { 
        super(json, connection)
    }
    get subhead() {
        return this.json.subhead
    }
}
