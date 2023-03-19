import { Query, QueryArgs as GenericQueryArgs } from "./Query";
import { Connection, Route } from "./Connection";
import { Retrievable } from "./Retrievable";
import { Single } from "./Single";
import { Page } from "./Page";
import { Post } from "./Post";

export interface Template<T extends Single = Single>
  extends Retrievable<Template> {}
export class Template<T extends Single = Single>
  implements Retrievable<Template>, Template.Properties
{
  constructor(readonly connection: Connection, protected json: Template.JSON) {}

  get globalQuery(): Query<T> {
    return new Query(this.connection, Template.GlobalQueryArgs<T>(this.json));
  }

  get type() {
    return this.json.properties.type;
  }

  get frontPageType() {
    return this.json.properties.frontPageType;
  }

  get isSingle() {
    return this.json.properties.type == Template.TemplateType.Single;
  }

  get isFrontPage() {
    return this.json.properties.type == Template.TemplateType.FrontPage;
  }

  get slug() {
    return this.json.properties.slug;
  }

  get objectid() {
    return this.json.properties.id;
  }
}

export namespace Template {
  export const Resolve = (
    template: Template,
    contextuals: Template.Contextual[]
  ) => {
    var bestMatch = {
      element: undefined,
      score: 0,
    };

    contextuals.map((contextual) => {
      let score = matchScore(template, contextual);
      console.log("scoring...", contextual, score);
      if (score > bestMatch.score) {
        bestMatch = {
          score: score,
          element: contextual,
        };
      }
    });

    return bestMatch.element;
  };

  const matchScore = (template: Template, contextual: Template.Contextual) => {
    if (!template) {
      return -1;
    }
    if (!contextual.definition) {
      return -99;
    }

    let definition = contextual.definition;
    let score = 0;

    switch (template.type) {
      case Template.TemplateType.Blog:
        {
          if (definition.type == Template.TemplateType.Blog) {
            score = 400;
          }
        }
        break;
      case Template.TemplateType.FrontPage:
        {
          if (template.frontPageType == Template.FrontPageType.Home) {
            if (definition.type != Template.TemplateType.FrontPage) {
              score = -999;
            } else if (
              definition.frontPageType &&
              definition.frontPageType == template.frontPageType
            ) {
              score = 40;
            }
          } else if (template.frontPageType == Template.FrontPageType.Page) {
            if (
              definition.singleType &&
              definition.singleType == Template.SingleType.Page
            ) {
              score = 40;
            } else if (
              definition.frontPageType == Template.FrontPageType.Page
            ) {
              score = 60;
            }
          }
        }
        break;
      case Template.TemplateType.Single:
        {
          if (definition.type != Template.TemplateType.Single) {
            return -999;
          }
          if (
            definition.singleType &&
            definition.singleType !== definition.singleType
          ) {
            score = -99;
          } else if (
            definition.singleType != Template.SingleType.None &&
            definition.singleType === definition.singleType
          ) {
            score = 20;
          } else {
            score = 10;
          }
        }
        break;
      default:
        score = -99;
        break;
    }

    return score;
  };
}

// Template Query

export namespace Template {
  export interface QueryParams {
    path;
  }

  export const QueryArgs = (params: QueryParams) =>
    new GenericQueryArgs<Template, QueryParams>(
      Template,
      new Route("template"),
      params
    );
}

// Global Query

export namespace Template {
  export interface Properties {
    type: Template.TemplateType;
    singleType?: Template.SingleType;
    frontPageType?: Template.FrontPageType;
    archiveType?: Template.ArchiveType;
    archiveDateType?: Template.ArchiveDateType;

    slug?: string;
    postType?: string;
    nicename?: string;
    id?: string;
    taxonomy?: string;
    taxonomyTerm?: string;
  }

  export interface JSON {
    properties: Properties;
    queryArgs: any;
  }

  export const GlobalQueryArgs = <T extends Single>(
    params: Template.JSON,
    type: Retrievable<T> = typeForProperties<T>(params.properties)
  ) =>
    new GenericQueryArgs<T, Template.JSON>(
      type,
      routeForType(params.properties),
      params.queryArgs
    );

  const typeForProperties = <T>(
    properties: Template.Properties
  ): Retrievable<T> => {
    var type;
    switch (properties.type) {
      case Template.TemplateType.FrontPage:
        type = typeForFrontPage(properties.frontPageType);
      case Template.TemplateType.Single:
        if (properties.singleType == Template.SingleType.Page) {
          type = Page;
        } else {
          type = Post;
        }
        break;
      case Template.TemplateType.Blog:
        type = Post;
      default:
        break;
    }
    return type || Post;
  };

  const typeForFrontPage = <T>(
    frontPageType: FrontPageType
  ): Retrievable<T> => {
    var type;
    switch (frontPageType) {
      case Template.FrontPageType.Home:
        type = Post;
      case Template.FrontPageType.Page:
        type = Page;
    }
    return type;
  };

  const routeForType = (properties: Template.Properties): Route => {
    var route;
    switch (properties.type) {
      case Template.TemplateType.FrontPage:
        route = routeForFrontPage(properties.frontPageType);
      case Template.TemplateType.Single:
        if (properties.singleType == Template.SingleType.Page) {
          route = new Route("page");
        } else {
          route = new Route("post");
        }
        break;
      case Template.TemplateType.Blog:
        route = new Route("post");
      default:
        break;
    }
    return route || new Route("page");
  };

  const routeForFrontPage = <T>(
    frontPageType: FrontPageType
  ): Retrievable<T> => {
    var type;
    switch (frontPageType) {
      case Template.FrontPageType.Home:
        type = new Route("post");
      case Template.FrontPageType.Page:
        type = new Route("page");
    }
    return type;
  };
}

// Contextuals

export namespace Template {
  export interface Contextual {
    definition: Template.Properties;
    query: Query<Template>;
    hidden: boolean;
  }
}

// Template Enums

export namespace Template {
  export enum TemplateType {
    FrontPage = 1,
    Search = 2,
    Archive = 3,
    Blog = 4,
    Single = 5,
    PageNotFound = -1,
  }

  export enum SingleType {
    Page = 1,
    Post = 2,
    Attachment = 3,
    Custom = 4,
    None = 0,
  }

  export enum FrontPageType {
    Home = 1,
    Page = 2,
    None = 0,
  }

  export enum ArchiveType {
    Author,
    Category,
    CustomPostType,
    Date,
    Tag,
  }

  export enum ArchiveDateType {
    None,
    Year,
    Month,
    Day,
  }
}
