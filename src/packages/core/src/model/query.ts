import { Connection, Route } from "./Connection";
import { Retrievable } from "./Retrievable";

export interface Query<T> {
    readonly connection : Connection
}
export interface SingleQuery<T> extends Query<T> {
    readonly result : Promise<T>
    readonly args
}

export interface MultiQuery<T> extends Query<T> {
    readonly results : Promise<T[]>
}

export class Query<T> implements SingleQuery<T>, MultiQuery<T> {
    private promise : Promise<T[]>

    get results() : Promise<T[]> {
        if (!this.promise) {
            this.promise = this.connection.request(this.args)
        }
        return this.promise
    }
    get result() : Promise<T> {
        return this.results.then(results => results[0])
    }

    constructor(readonly connection : Connection, readonly args : QueryArgs<T, any>) { }
}

export class QueryArgs<T,P = any> {
    constructor(readonly type : Retrievable<T>, readonly route : Route, readonly params : P) { }
}

