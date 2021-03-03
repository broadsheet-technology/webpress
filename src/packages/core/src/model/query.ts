
import { Connection, Route } from "./Connection";
import { Retrievable } from "./Retrievable";

export interface SingleQuery<T>{
    readonly result : Promise<T>
    readonly args
}

export interface MultiQuery<T>{
    readonly results : Promise<T[]>
}

export class Query<T> implements SingleQuery<T>, MultiQuery<T> {
    get result() : Promise<T> {
        return this.connection.request(this).then(results => results[0])
    }
    get results() : Promise<T[]> {
        return this.connection.request(this)
    }
    constructor(readonly connection : Connection, readonly args : QueryArgs<T>) { }
}

export abstract class QueryArgs<T,P = any> {
    abstract params: P

    constructor(readonly type : Retrievable<T>, readonly route : Route) { }
}



