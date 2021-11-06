import { Connection, QueriedOject } from "..";
import { QueryArgs, Query as GenericQuery, Queryable, Retrievable } from "./query";


export namespace Linked {
    export const QueryArgs = <T extends QueriedOject>(type: Retrievable<T>, id: number) => GenericQuery.ArgBuilder(type, { id: id });
    export const Query = <T extends QueriedOject, A extends { id: number }>(connection: Connection, args: QueryArgs<T, A>) => Queryable.Query(connection, args)
}
