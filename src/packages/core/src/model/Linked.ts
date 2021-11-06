import { Connection, QueriedOject } from "..";
import { QueryArgs, Query as GenericQuery, Queryable, Retrievable } from "./query";


export namespace Linked {
    export function QueryArgs<T extends QueriedOject>(type: Retrievable<T>, id: number) : QueryArgs<T, { id: number }> {
        return GenericQuery.ArgBuilder<T, {id: number}>(type, { id: id }) as QueryArgs<T, { id: number}>
    }
    export const Query = <T extends QueriedOject>(connection: Connection, args: QueryArgs<T, { id: number }>) => Queryable.Query(connection, args) as GenericQuery<T>
}
