import { Connection, Route } from "./Connection";

export interface Query<T extends QueriedOject> {
    readonly connection: Connection;
}

export interface SingleQuery<T extends QueriedOject> extends Query<T> {
    readonly result: Promise<T>;
    readonly args;
}

export interface MultiQuery<T extends QueriedOject> extends Query<T> {
    readonly results: Promise<T[]>;
}

export enum QueryState {
    uninvoked,
    pending,
    resolved,
    failed,
}

export abstract class Query<T extends QueriedOject, P = any>
    implements SingleQuery<T>, MultiQuery<T>
{
    private promise: Promise<T[]>;
    private _state = QueryState.uninvoked;

    get results(): Promise<T[]> {
        if (!this.promise) {
            this._state = QueryState.pending;
            this.promise = this.connection
                .request(this.args)
                .then((results) => {
                    this._state = QueryState.resolved;
                    return results;
                })
                .catch((onreject) => {
                    this._state = QueryState.failed;
                    console.warn("QUERY FAILED—", onreject);
                    return onreject;
                });
        }
        return this.promise;
    }

    get result(): Promise<T> {
        return this.results.then((results) => results[0]);
    }

    get state(): QueryState {
        return this._state;
    }

    constructor(
        readonly connection: Connection,
        readonly args: QueryArgs<T, P>
    ) {}
}

export abstract class QueryArgs<T extends QueriedOject, P = any> {
    constructor(readonly type: Retrievable<T, P>, readonly args: P) {}
}

export interface QueriedOject {}

export interface Retrievable<T extends QueriedOject, A = any, J = any> {
    new (response: QueryResponse<T, A, J>): T;
    Route: () => Route;
    QueryArgs: (args: A) => QueryArgs<T, A>;
    Query: (connection: Connection, args: QueryArgs<T, A>) => Query<T, A>;
}

export interface QueryResponse<_T extends QueriedOject, _A = any, J = any> {
    connection: Connection
    json: J;
}

export interface Queryable<T extends QueriedOject, A = any, J = any> {}
export abstract class Queryable<T extends QueriedOject, A = any, J = any>
    implements QueriedOject
{
    constructor(protected response: QueryResponse<T, A, J>) {}

    static Query = <T extends QueriedOject, A = any>(
        connection: Connection,
        args: QueryArgs<T, A>
    ) =>
        new (class extends Query<T, A> {
            constructor(connection: Connection, args: QueryArgs<T, A>) {
                super(connection, args);
            }
        })(connection, args) as Query<T>;
}

export namespace Query {
    export const ArgBuilder = <T extends QueriedOject, A = any>(
        type: Retrievable<T, A>,
        args: A
    ) =>
        new (class extends QueryArgs<T, A> {
            constructor(type: Retrievable<T, A>, args: A) {
                super(type, args);
            }
        })(type, args) as QueryArgs<T, A>;

}
