import { Template } from "@webpress/core"

export namespace Hierarchy {
    export const Resolve = (hierarchy: TemplateHierarchy, template: Template) => new TemplateResolver(hierarchy, template).templateComponent

    export type TemplateHierarchy = {
        index: TemplateDefinition
        archive?: TemplateDefinition
        singular?: TemplateDefinition | SinglularOverrides
        frontPage?: TemplateDefinition
        blogPage?: TemplateDefinition
        error404?: TemplateDefinition
        search?: TemplateDefinition
        oembed?: TemplateDefinition
    } | {
        index?: TemplateDefinition
        archive: TemplateDefinition
        singular: TemplateDefinition | SinglularOverrides
        frontPage: TemplateDefinition
        blogPage: TemplateDefinition
        error404: TemplateDefinition
        search: TemplateDefinition
        oembed: TemplateDefinition
    }
    
    export type TemplateDefinition = string | {
        component: string
        props?: { [key: string]: any };
        disableReuse?: boolean
    }

    export type SinglularOverrides = {
        index: TemplateDefinition
        slug?: Record<string, TemplateDefinition>
        id?: Map<string, TemplateDefinition>
    }
    
    export interface ArchiveOverrides {
        author?: TemplateDefinition
        category?: CategoryArchiveTemplateComponent
    }
    
    export type CategoryArchiveTemplateComponent = TemplateDefinition | {
        slug?: Record<string, TemplateDefinition>
        id: Map<string, TemplateDefinition>
    } | {
        slug: Record<string, TemplateDefinition>
        id?: Map<string, TemplateDefinition>
    }
    
    class TemplateResolver {
        private resolved
        constructor(private hierarchy : TemplateHierarchy, private template: Template) { }

        get templateComponent() : TemplateDefinition {
            if (!this.resolved) {
                this.resolved = this.lazyResolve()
            }
            return this.resolved
        }

        private lazyResolve() {
            switch (this.template.type) {
                case Template.TemplateType.Single:
                    console.log("it is a single")
                    return this.resolveSingular()   
                case Template.TemplateType.FrontPage:
                    if(this.hierarchy.frontPage) {
                        return this.hierarchy.frontPage    
                    }
                case Template.TemplateType.Archive:
                case Template.TemplateType.Blog:
                    if (this.hierarchy.archive) {
                        return this.hierarchy.archive    
                    }
                default:
                    if (!this.hierarchy.index) {
                        console.error("unresolvable template", this.template, this.hierarchy)
                    }
                    return this.hierarchy.index
            }
        }

        private resolveSingular() : TemplateDefinition {
            let singular = this.hierarchy.singular
            if (!singular) {
                console.log("NO SINGULAR ON THE THINGGLY", this.hierarchy)
                return this.hierarchy.index
            }

            let slugs = (singular as SinglularOverrides).slug
            let ids = (singular as SinglularOverrides).id
            let index = (singular as SinglularOverrides).index

            if (slugs) {
                for (const slug in slugs) {
                    if (this.template.slug == slug) {
                        return slugs[slug]
                    }
                }
            }

            if (ids) {
                for (const id in ids) {
                    if (this.template.objectid == id) {
                        return ids[id]
                    }
                }
            }

            if (index) {
                return index
            }

            return singular as TemplateDefinition
        }
    }
}