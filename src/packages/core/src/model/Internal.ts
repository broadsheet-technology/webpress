import { Connection } from "./Connection";
import { QueriedOject, Query, QueryArgs, QueryState } from "./Query";

export abstract class BaseQuery<Type extends QueriedOject, Args = any> implements Query<Type, Args> {
    private promise: Promise<Type[]>;
    private _state = QueryState.uninvoked;

    get results(): Promise<Type[]> {
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

    get result(): Promise<Type> {
        return this.results.then((results) => results[0]);
    }

    get state(): QueryState {
        return this._state;
    }

    constructor(
        readonly connection: Connection,
        readonly args: QueryArgs<Type, Args>
    ) {}
}