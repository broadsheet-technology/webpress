import { Connection } from "./Connection";
import { Query as InternalQuery, Queryable, QueryArgs } from "./Query"

export class Author extends Queryable<Author, Author.Args> {
    static QueryArgs = (params: Author.Args) => QueryArgs.ArgBuilder(Author, params);
    static Route = () => Connection.RouteBuilder("author");
    
    link: string;
    
    get name() {
        return this.response.json.name
    }
    get avatarSrc() : string {
        return this.response.json.avatar_urls["96"]
    }
    url: string;
}

export namespace Author {
    export type Args = {
        name: string
    }
    
    export type Query<Args extends Author.Args = Author.Args> = InternalQuery<Author, Args>
}
