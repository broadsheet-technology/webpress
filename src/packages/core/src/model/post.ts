import { Single } from './Single'
import { Connection } from './Connection';
import { Retrievable } from './Retrievable';

export interface Post extends Retrievable<Post> { }
export class Post extends Single {
    readonly route = "post"
    constructor(json: any, connection: Connection) { 
        super(json, connection)
    }
    get subhead() {
        return this.json.subhead
    }
}
