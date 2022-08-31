import { Connection } from "./Connection";
import { Query } from "./Query";

export interface QueryContextual {
  query: Query<any>;
}

export class Theme {
  constructor(
    readonly connection: Connection,
    readonly definition: Theme.Definition
  ) {}
}

export namespace Theme {
  export interface Definition {
    root: any;
    dir: string;
  }
}
