import { Connection, Route } from "./Connection";
import { Query } from "./Query";
import { Retrievable } from "./Retrievable";

export interface LinkedObjectQuery<T> extends Query<T> {}
export class LinkedObjectQuery<T> extends Query<T> {
  constructor(connection: Connection, type: Retrievable<T>, id: string) {
    super(connection, {
      route: new Route("//todo..."),
      type: type,
      params: {
        id: id,
      },
    });
  }
}

export type LinkedObject<T extends Retrievable<T>> = Promise<T>;
