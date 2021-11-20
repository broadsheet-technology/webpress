import { Connection, Route } from "./Connection";
import { BaseQuery } from "./Internal";

export interface Query<Type extends QueriedOject, Args = any> {
    readonly connection: Connection;
}

export enum QueryState {
    uninvoked,
    pending,
    resolved,
    failed,
}

export abstract class QueryArgs<T extends QueriedOject, Args = any> {
    constructor(readonly type: Retrievable<T, Args>, readonly args: Args) {}
}

export interface QueriedOject { }

export interface Retrievable<T extends QueriedOject, Args = any, J = any> {
    new (response: QueryResponse<T, Args, J>): T;
    Route: () => Route;
    QueryArgs: (args: Args) => QueryArgs<T, Args>;
  //  Query: (connection: Connection, args: QueryArgs<T, Args>) => Query<T, Args>;
}

export interface QueryResponse<_T extends QueriedOject, _Args = any, J = any> {
    connection: Connection
    json: J;
}

export interface Queryable<T extends QueriedOject, Args = any, J = any> {}
export abstract class Queryable<T extends QueriedOject, Args = any, J = any>
    implements QueriedOject
{
    constructor(protected response: QueryResponse<T, Args, J>) {}
}

export namespace Query {
    export const QueryBuilder = <T extends QueriedOject, Args = any>(
        connection: Connection,
        args: QueryArgs<T, Args>
    ) =>
        new (class extends BaseQuery<T, Args> {
            constructor(connection: Connection, args: QueryArgs<T, Args>) {
                super(connection, args);
            }
        })(connection, args) as Query<T, Args>
}

export namespace QueryArgs {
    export const ArgBuilder = <T extends QueriedOject, Args = any>(
        type: Retrievable<T, Args>,
        args: Args
    ) =>
        new (class extends QueryArgs<T, Args> {
            constructor(type: Retrievable<T, Args>, args: Args) {
                super(type, args);
            }
        })(type, args) as QueryArgs<T, Args>;
}
