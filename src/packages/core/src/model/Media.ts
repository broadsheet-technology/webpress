import { Connection, Route } from "./Connection";

import { Query } from "./Query";
import { LinkedQueryArgs } from "./Linked";
import { Retrievable } from "./Retrievable";
import { Author } from "./Author";


export interface MediaQuery {
    id?: number
}
export interface Media extends Retrievable<Media> { }
export class Media  {
    constructor(readonly connection: Connection, protected json: any) { }

    get src() {
        return this.json.source_url
    }

    get author() : Promise<Author> {
        return new Query(this.connection, new LinkedQueryArgs(Author, new Route("author"), this.json.author)).result
    }

    get byline() : { author?: string, creditLine: string } {
        return {
            author: this.json['meta']._webpress_byline_author,
            creditLine: this.json['meta']._webpress_byline_credit_line
        }
    }
}