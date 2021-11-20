import { Connection } from "./Connection";
import { Linked } from "./Linked";
import { Author } from "./Author";
import { Query as InternalQuery, Queryable, QueryArgs } from "./Query";

export class Media extends Queryable<Media, Media.Args> {
    static QueryArgs = (params: Media.Args) => QueryArgs.ArgBuilder(Media, params);
    static Route = () => Connection.RouteBuilder("media");

    get src() {
        return this.response.json.source_url;
    }

    get author() : Author.Query {
        return Linked.Query(this.response.connection, Linked.QueryArgs<Author>(Author, this.response.json.author))
    }

    get byline(): { author?: string; creditLine: string } {
        return {
            author: this.response.json["meta"]._webpress_byline_author,
            creditLine: this.response.json["meta"]._webpress_byline_credit_line,
        };
    }
}

export namespace Media {
    export type Args = {
        id: number;
    };
    export type Query<Args extends Media.Args = Media.Args> = InternalQuery<Media, Args>
}
