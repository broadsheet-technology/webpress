import { Single } from "./Single";
import { Route } from "./Connection";
import { Retrievable } from "./Retrievable";
import { QueryArgs as GlobalQueryArgs } from "./Query";

export interface Post extends Retrievable<Post> {}
export class Post extends Single {
  readonly route = "post";

  get subhead() {
    return this.json.subhead;
  }
}

export namespace Post {
  export interface QueryParams {
    id?;
    page?: number;
    per_page?: number;
    search?: string;
    after?;
    author?;
    author_exclude?;
    before?;
    include?: number[];
    exclude?: number[];
    offset?;
    order?: "asc" | "desc";
    orderby?:
      | "author"
      | "date"
      | "id"
      | "include"
      | "modified"
      | "parent"
      | "relevance"
      | "slug"
      | "include_slugs"
      | "title";
    slug?: string;
    status?: "publish" | string;
    tax_relation?;
    categories?;
    categories_exclude?;
    tags?;
    tags_exclude?;
  }

  export const QueryArgs = <Params extends QueryParams>(params: Params) =>
    new GlobalQueryArgs<Post, Params>(Post, new Route("post"), params);
}
