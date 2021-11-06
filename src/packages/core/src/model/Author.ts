import { Connection } from "./Connection";
import { Query, Queryable } from "./Query"

export class Author extends Queryable<Author, Author.Args> {
    static QueryArgs = (params: Author.Args) => Query.ArgBuilder(Author, params);
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
    export type Args = any
    export type Query = ReturnType<typeof Author.Query>
}
