import { Single } from './Single'
import { Connection } from './Connection';
import { Retrievable } from './Retrievable';

export interface Post extends Retrievable<Post> { }
export class Post extends Single {
    readonly route = "post"
    constructor(connection: Connection, json: any) { 
        super(connection, json)
    }
    get subhead() {
        return this.json.subhead
    }
}
