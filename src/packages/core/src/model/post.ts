import { Single } from './single'
import { WebpressConnection } from './connection';

export class Post extends Single {
    readonly route = "post"
    constructor(json: any, connection: WebpressConnection) { 
        super(json, connection)
    }
}


export class WebMedia {
    readonly author: string ;
    
    constructor(private wpmedia?: any) { }

    get url() {
        return this.wpmedia.source_url
    }

    size() {

    }
}
