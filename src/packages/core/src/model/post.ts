import { Single } from './Single'
import { Route } from './Connection';
import { Retrievable } from './Retrievable';
import { QueryArgs as GlobalQueryArgs } from './Query'

export interface Post extends Retrievable<Post> { }
export class Post extends Single {
    readonly route = "post"

    get subhead() {
        return this.json.subhead
    }
}

export namespace Post {
    export interface QueryParams {
        id?,
    }

    export const QueryArgs = (params: QueryParams) => 
        new GlobalQueryArgs<Post, QueryParams>(Post, new Route("post"), params)
}
