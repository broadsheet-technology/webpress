import { Single } from './Single'
import { Connection } from './Connection';
import { Query } from './Query';

export class Post extends Single<Post> {
    static QueryArgs = (params: Post.Args) => Query.ArgBuilder(Post, params);
    static Route = () => Connection.RouteBuilder("post");

    get subhead() {
        return this.response.json.subhead
    }
}

namespace Post {
    export type Args = {
        id? : String,
        slug? : String
    }
}
