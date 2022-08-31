import { Single } from "./Single"
import { Connection, Route } from "./Connection"
import { Retrievable } from "./Retrievable"
import { QueryArgs } from "./Query"

export interface PageQueryParams {
    id? : String,
    slug? : String
}

export class PageQueryArgs extends QueryArgs<Page, PageQueryParams> {
    constructor(params) {
        super(Page, new Route("page"), params)
    } 
}

export interface Page extends Retrievable<Page> { }
export class Page extends Single {
    constructor(connection: Connection, json: any) { 
        super(connection, json)
    }
}