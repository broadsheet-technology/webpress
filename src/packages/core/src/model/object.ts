import { WebpressConnection, Retrievable } from "..";
import { WebpressQuery } from "./query";

export interface WebpressObject {
    readonly link : string 
    readonly route : string
}

export class LinkedObject<T extends WebpressObject> {
    constructor(
        private cls : Retrievable<T>, 
        readonly id, 
        private connection: WebpressConnection) {
    }

    get query(): Promise<T> {
        var route = new this.cls().route
        var query : WebpressQuery<T> = {
            args: {
                id: this.id
            },
            type: this.cls
        }
        if(!query.args.id) {
            return undefined
        }
        return this.connection.get(route,query)
    }
}

