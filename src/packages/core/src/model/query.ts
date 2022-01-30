import { Connection, Route } from "./Connection";
import { Retrievable } from "./Retrievable";

export interface Query<T> {
  readonly connection: Connection;
}
export interface SingleQuery<T> extends Query<T> {
  readonly result: Promise<T>;
  readonly args;
}

export interface MultiQuery<T> extends Query<T> {
  readonly results: Promise<T[]>;
}

export class Query<T> implements SingleQuery<T>, MultiQuery<T> {
  private response: Promise<any> = this.connection.request(this.args);

  get results(): Promise<T[]> {
    return this.response.then((response) => {
      let Constructor = this.args.type;
      if (this.args.params.id) {
        return [new Constructor(this.connection, response)];
      } else {
        return response.map(
          (objectJson) => new Constructor(this.connection, objectJson)
        );
      }
    });
  }

  get paging(): Promise<Query.Pagination<T>> {
    return this.response.then((response) => ({
      total: response._paging.total,
      totalPages: response._paging.totalPages,
      perPage: this.args.params.perPage,
      page: this.args.params.page || 1,
    }));
  }

  get result(): Promise<T> {
    return this.results.then((results) => results[0]);
  }

  constructor(
    readonly connection: Connection,
    readonly args: QueryArgs<T, any>
  ) {}
}

export class QueryArgs<T, P = any> {
  readonly params: P & {
    // default params of all queries
    perPage?: number;
    page?: number;
  };

  constructor(readonly type: Retrievable<T>, readonly route: Route, params: P) {
    this.params = params;
  }
}

export namespace Query {
  export type Pagination<T> = {
    total: number;
    totalPages: number;
    perPage: number;
    page: number;
    next?: Query<T>;
    previous?: Query<T>;
  };
}
