import { Single } from "./Single"
import { Connection } from "./Connection"
import { Retrievable } from "./Retrievable"

export interface Page extends Retrievable<Page> { }
export class Page extends Single {
    constructor(connection: Connection, json: any) { 
        super(connection, json)
    }
}