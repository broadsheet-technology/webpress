import { Template } from "@webpress/core";

export namespace Hierarchy {
  export const Resolve = (hierarchy: TemplateHierarchy, template: Template) =>
    new TemplateResolver(hierarchy, template).templateComponent;

  export type TemplateHierarchy =
    | {
        index: TemplateDefinition;
        archive?: TemplateDefinition;
        singular?: TemplateDefinition | SingularTemplateTypeOverrides;
        frontPage?: TemplateDefinition;
        blogPage?: TemplateDefinition;
        error404?: TemplateDefinition;
        search?: TemplateDefinition;
        oembed?: TemplateDefinition;
      }
    | {
        index?: TemplateDefinition;
        archive: TemplateDefinition;
        singular: TemplateDefinition | SingularTemplateTypeOverrides;
        frontPage: TemplateDefinition;
        blogPage: TemplateDefinition;
        error404: TemplateDefinition;
        search: TemplateDefinition;
        oembed: TemplateDefinition;
      };

  export type TemplateDefinition = {
    component: String;
    props?: { [key: string]: any };
    disableReuse?: boolean;
  };

  export type SingularTemplateTypeOverrides = {
    post: TemplateDefinition | PostOverrides;
    page: TemplateDefinition | PageOverrides;
  };

  export type PageOverrides = {
    index: TemplateDefinition;
    slug?: Record<string, TemplateDefinition>;
    id?: Map<string, TemplateDefinition>;
  };

  export type PostOverrides = {};

  export interface ArchiveTypes {
    author?: TemplateDefinition;
    category?: CategoryArchiveTemplateComponent;
  }

  export type CategoryArchiveTemplateComponent =
    | TemplateDefinition
    | {
        slug?: Record<string, TemplateDefinition>;
        id: Map<string, TemplateDefinition>;
      }
    | {
        slug: Record<string, TemplateDefinition>;
        id?: Map<string, TemplateDefinition>;
      };

  class TemplateResolver {
    private resolved;
    constructor(
      private hierarchy: TemplateHierarchy,
      private template: Template
    ) {}

    get templateComponent(): TemplateDefinition {
      if (!this.resolved) {
        this.resolved = this.lazyResolve();
      }
      return this.resolved;
    }

    private lazyResolve() {
      switch (this.template.type) {
        case Template.TemplateType.Single:
          return this.resolveSingular();
        case Template.TemplateType.FrontPage:
          if (this.hierarchy.frontPage) {
            return this.hierarchy.frontPage;
          }
        case Template.TemplateType.Archive:
        case Template.TemplateType.Blog:
          if (this.hierarchy.archive) {
            return this.hierarchy.archive;
          }
        default:
          if (!this.hierarchy.index) {
            console.error(
              "unresolvable template",
              this.template,
              this.hierarchy
            );
          }
          return this.hierarchy.index;
      }
    }

    private resolveSingular(): TemplateDefinition {
      let singular = this.hierarchy.singular;

      if (isTemplateDefinition(singular)) {
        return singular;
      }

      if (isSingularTemplateTypeOverrides(singular)) {
        switch (this.template.singleType) {
          case Template.SingleType.Page:
            return this.resolvePage(singular.page);
          case Template.SingleType.Post:
            return this.resolvePost(singular.post);
        }
      }
    }

    private resolvePost(post: TemplateDefinition | PostOverrides) {
      if (isTemplateDefinition(post)) {
        return post;
      }

      throw new Error("not implemented");
    }

    private resolvePage(
      page: TemplateDefinition | PageOverrides
    ): TemplateDefinition {
      if (isTemplateDefinition(page)) {
        return page;
      }

      page = page as PageOverrides;

      let slugs = page.slug;
      let ids = page.id;
      let index = page.index;

      if (slugs) {
        for (const slug in slugs) {
          if (this.template.slug == slug) {
            return slugs[slug];
          }
        }
      }

      if (ids) {
        for (const id in ids) {
          if (this.template.objectid == id) {
            return ids[id];
          }
        }
      }

      if (index) {
        return index;
      }
    }
  }

  function isTemplateDefinition(node: any): node is TemplateDefinition {
    return (node as TemplateDefinition).component !== undefined;
  }

  function isSingularTemplateTypeOverrides(
    singular: TemplateDefinition | SingularTemplateTypeOverrides
  ): singular is SingularTemplateTypeOverrides {
    return (
      (singular as SingularTemplateTypeOverrides).post !== undefined ||
      (singular as SingularTemplateTypeOverrides).page !== undefined
    );
  }
}
