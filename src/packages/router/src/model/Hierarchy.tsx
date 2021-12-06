import { h } from "@stencil/core";
import { Template } from "@webpress/core";

export namespace Hierarchy {
  export const Resolve = (hierarchy: TemplateHierarchy, template: Template) =>
    new TemplateResolver(hierarchy).resolve(template, undefined);

  export type TemplateHierarchy =
    | {
        index: TemplateDefinition;
        archive?: TemplateDefinition;
        singular?: TemplateDefinition | SinglularOverrides;
        frontPage?: TemplateDefinition;
        blogPage?: TemplateDefinition;
        error404?: TemplateDefinition;
        search?: TemplateDefinition;
        oembed?: TemplateDefinition;
      }
    | {
        index?: TemplateDefinition;
        archive: TemplateDefinition;
        singular: TemplateDefinition | SinglularOverrides;
        frontPage: TemplateDefinition;
        blogPage: TemplateDefinition;
        error404: TemplateDefinition;
        search: TemplateDefinition;
        oembed: TemplateDefinition;
      };

  export type TemplateDefinition =
    | string
    | {
        component: string;
        props?: { [key: string]: any };
        disableReuse?: boolean;
      };

  export type SinglularOverrides = {
    index: TemplateDefinition;
    slug?: Record<string, TemplateDefinition>;
    id?: Map<string, TemplateDefinition>;
  };

  export interface ArchiveOverrides {
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

  export class TemplateResolver {
    private templateCache = new Map<Template, TemplateDefinition>();
    private componentCache = new Map<string, any>();

    constructor(private hierarchy: TemplateHierarchy) {}

    resolve(template: Template, query: Template.Query) {
      if (!this.templateCache.has(template)) {
        this.templateCache.set(template, this.lazyResolve(template));
      }

      let definition = this.templateCache.get(template);

      if (!definition) {
        console.error("No template resolved!");
      }

      console.log("def", definition);

      
      let props = definition instanceof Object ? definition.props || [] : [];

      let instance = <Component {...props} query={query} />;
      return 
    }

    private resolveComponent(definition: TemplateDefinition, query :Template.Query) {

        let Component = definition instanceof Object ? definition.component : definition;

        if (!this.componentCache.has(Component)) {
            this.componentCache.set(Component, this.instanciate(definition));
        }
        let component = 
        return this.
    }

    private lazyResolve(template: Template) {
      switch (template.type) {
        case Template.TemplateType.Single:
          console.log("it is a single");
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
            console.error("unresolvable template", template, this.hierarchy);
          }
          return this.hierarchy.index;
      }
    }

    private resolveSingular(): TemplateDefinition {
      let singular = this.hierarchy.singular;
      if (!singular) {
        console.log("NO SINGULAR ON THE THINGGLY", this.hierarchy);
        return this.hierarchy.index;
      }

      let slugs = (singular as SinglularOverrides).slug;
      let ids = (singular as SinglularOverrides).id;
      let index = (singular as SinglularOverrides).index;

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

      return singular as TemplateDefinition;
    }
  }
}
