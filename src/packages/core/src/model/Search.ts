import { Retrievable } from "./Retrievable";
import { QueryArgs as GlobalQueryArgs } from "./Query";
import { Connection, Route } from "./Connection";

export interface SearchResult extends Retrievable<SearchResult> {}
export class SearchResult {
  readonly route = "search";

  constructor(readonly connection: Connection, protected json: any) {}

  get id() {
    return this.json.id;
  }

  get title() {
    return this.json.title;
  }

  get subtype() {
    return this.json.subtype;
  }

  get url() {
    return this.json.url;
  }
}

export namespace Search {
  export interface QueryParams {
    search?: string;
    page?: number;
    per_page?: number;
    type?: "post" | "term" | "post-format";
    subtype?: any;
    context?: "view" | "embed";
  }

  export const QueryArgs = (params: QueryParams) =>
    new GlobalQueryArgs<SearchResult, QueryParams>(
      SearchResult,
      new Route("search"),
      params
    );
}
