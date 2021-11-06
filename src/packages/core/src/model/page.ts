import { Single } from "./Single"
import { Connection } from "./Connection"
import { Query } from "./Query"

export class Page extends Single<Page> {
    static QueryArgs = (params: Page.Args) => Query.ArgBuilder(Page, params);
    static Route = () => Connection.RouteBuilder("media");
}

namespace Page {
    export type Args = {
        id? : String,
        slug? : String
    }
}

