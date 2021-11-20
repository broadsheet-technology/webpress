import { Connection, QueriedOject } from "..";
import { QueryArgs as InternalQueryArgs, Query, Queryable, Retrievable } from "./query";

export class Linked {
    /**
     * Factory method for instanciating a Query for a Linked WordPress entity
     *
     * @param connection Connection to execute this Query on
     * @param args QueryArgs returned by Linked.QueryArgs
     * @returns a Query for the linked entity
     */
    static Query = <Type extends QueriedOject>(
        connection: Connection,
        args: InternalQueryArgs<Type, { id: number }>
    ) => Queryable.Query(connection, args) as Query<Type>;
}

export namespace Linked {
    /**
     * Factory method for instanciating QueryArgs for querying
     * a Linked WordPress entity
     *
     * @param type type of the entity (Post, Page, Media, etc.)
     * @param id id of the entity to load
     * @returns QueryArgs to create a Query for the linked entity
     */
    export function QueryArgs<Type extends QueriedOject>(
        type: Retrievable<Type>,
        id: number
    ): InternalQueryArgs<Type, { id: number }> {
        return InternalQueryArgs.ArgBuilder<Type, { id: number }>(type, {
            id: id,
        }) as InternalQueryArgs<Type, { id: number }>;
    }
}
