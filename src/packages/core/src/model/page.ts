import { Single } from "./Single"
import { Connection } from "./Connection"
import { QueryArgs } from "./Query"

export class Page extends Single<Page> {
    static QueryArgs = (params: Page.Args) => QueryArgs.ArgBuilder(Page, params);
    static Route = () => Connection.RouteBuilder("media");
}

namespace Page {
    export type Args = {
        id? : String,
        slug? : String
    }
}

