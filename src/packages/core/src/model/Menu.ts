import { Template } from "./Template";
import { Single } from "./Single";
import { Route } from "./Connection";
import { QueryArgs as GlobalQueryArgs } from "./Query";
import { Retrievable } from "./Retrievable";

export enum MenuItemType {
  Page,
  Custom,
  Unknown,
}

export class MenuItem {
  get title(): string {
    return this.json.title;
  }
  get link(): string {
    return this.json.url;
  }
  get slug(): string {
    return this.json.object_slug;
  }

  get children(): Menu {
    return this.json.children
      ? new Menu(undefined, { items: this.json.children })
      : undefined;
  }

  isActive(post: Single, template: Template): boolean {
    if (this.type == MenuItemType.Page) {
      let matchesPage = template.isSingle && this.objectId == post.id;
      let matchesHomepage =
        template.isFrontPage &&
        template.frontPageType == Template.FrontPageType.Page &&
        this.objectId == post.id;
      return matchesHomepage || matchesPage;
    }
    return false;
  }

  get type(): MenuItemType {
    switch (this.json.type) {
      case "post_type":
        if (this.json.type_label === "Page") {
          return MenuItemType.Page;
        }
      case "custom":
        return MenuItemType.Custom;
      default:
        return MenuItemType.Unknown;
    }
  }

  get objectId(): number {
    return parseInt(this.json.object_id, 10);
  }

  constructor(private json: any) {}
  route: string;
}

export interface Menu extends Retrievable<Menu> {}
export class Menu {
  readonly items: MenuItem[];
  constructor(readonly connection, private json: any) {
    this.items = [...this.json.items].map((json) => new MenuItem(json));
  }
}

export namespace Menu {
  export interface QueryParams {
    id?;
    location?;
  }

  export const QueryArgs = (params: QueryParams) =>
    new GlobalQueryArgs<Menu, QueryParams>(Menu, new Route("menu"), params);
}
