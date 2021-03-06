import { QueryArgs, Route } from "..";
import { Retrievable } from "./Retrievable";

export interface LinkedQueryParams {
    id
}
export class LinkedQueryArgs<T> extends QueryArgs<T, LinkedQueryParams> {
    readonly params;
    constructor(type : Retrievable<T>, readonly route : Route, id) {
        super(type, route.string, { id: id })
    }
} 