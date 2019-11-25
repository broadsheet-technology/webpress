import { WPRoute } from "../json"
import { Single, Post } from "@webpress/core"

export enum TemplateType {
    FrontPage = 0,
    Search = 1,
    Archive = 2,
    Blog = 3,
    Single = 4,
    PageNotFound = 99
}

export enum TemplateSingleType {
    None = 0,
    Page = 1,
    Post = 2,
    Attachment = 3,
    Custom = 4,
}

export enum TemplateArchiveType {
    Author,
    Category,
    CustomPostType,
    Date,
    Tag
}

export enum TemplateArchiveDateType {
    None,
    Year,
    Month,
    Day
}

export interface TemplateMatch {
    type: TemplateType
    singleType?: TemplateSingleType
    archiveType?: TemplateArchiveType 
    archiveDateType?: TemplateArchiveDateType 

    slug?: string
    postType?: string
    nicename?: string
    id?: string
    taxonomy?: string 
    taxonomyTerm?: string
}

export class Template implements TemplateMatch {
    query: Single[]

    type: TemplateType
    singleType?: TemplateSingleType
    archiveType?: TemplateArchiveType
    archiveDateType?: TemplateArchiveDateType
    slug?: string
    postType?: string
    nicename?: string
    id?: string
    taxonomy?: string
    taxonomyTerm?: string
    matchScore(template: TemplateMatch) {
        console.log("scoring",template,this)
        let score = 0;
        if(template.type === this.type) {
            score += 10
        }

        if(template.singleType && template.singleType !== this.singleType) {
            return -999
        } else if(template.singleType && template.singleType === this.singleType) {
            score += 2
        }
        console.log(score)
        return score;
    }
}

export class TemplateContextual {
    match: TemplateMatch
    hidden: boolean
}

export class TemplateFactory {
    static templateFromRoute(route: WPRoute) : Template {
        const template = new Template()
        
        if(route === undefined || route.query.is_404) {
            return this.notFoundTemplate()
        } else if(route.query.is_home) {
            return this.homepageTemplate(route.query)
        } else if(route.query.is_archive) {
            return this.archiveTemplate()
        } else if(route.query.is_single || route.query.is_page) {
            return this.singleTemplate(route.query) 
        }
        return template
    }

    private static notFoundTemplate() {
        const template = new Template()
        template.type = TemplateType.PageNotFound
        return template;
    }

    private static homepageTemplate(query: any) {
        const template = new Template()
        template.type = TemplateType.FrontPage
        template.query = Post.fromList(query.posts)
        return template;
    }

    private static archiveTemplate() {
        const template = new Template()
        template.type = TemplateType.Archive
        return template;
    }

    private static singleTemplate(query: any) {
        const template = new Template()
        template.type = TemplateType.Single
        if(query.is_page) {
            template.singleType = TemplateSingleType.Page
        }
        if(query.is_single) {
            template.singleType = TemplateSingleType.Post
        }
        console.log("template",template, query)
        return template
    }
}