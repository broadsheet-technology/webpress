import { WPRoute } from "../json"


export enum TemplateType {
    FrontPage = 0,
    Search = 1,
    Archive = 2,
    Blog = 3,
    Single = 4,
    PageNotFound = 99
}

export enum TemplateSingleType {
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
    type: TemplateType;
    singleType?: TemplateSingleType;
    archiveType?: TemplateArchiveType;
    archiveDateType?: TemplateArchiveDateType;
    slug?: string;
    postType?: string;
    nicename?: string;
    id?: string;
    taxonomy?: string;
    taxonomyTerm?: string; 
    matchScore(template: TemplateMatch) {
        let score = 0;
        if(template.type === this.type) {
            console.log(this,"10!")
            score += 10
        }

        if(template.singleType && template.singleType === this.singleType) {
            score += 9
        }
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
            return this.homepageTemplate()
        } else if(route.query.is_archive) {
            return this.archiveTemplate()
        } else if(route.query.is_single) {
            return this.singleTemplate(route) 
        }
        return template
    }

    private static notFoundTemplate() {
        const template = new Template()
        template.type = TemplateType.PageNotFound
        return template;
    }

    private static homepageTemplate() {
        const template = new Template()
        template.type = TemplateType.FrontPage
        return template;
    }

    private static archiveTemplate() {
        const template = new Template()
        template.type = TemplateType.Archive
        return template;
    }

    private static singleTemplate(route: WPRoute) {
        const template = new Template()
        if(route.query.is_page) {
            template.singleType = TemplateSingleType.Page
        } else {
            template.singleType = TemplateSingleType.Post
        }
        template.type = TemplateType.Single
        return template
    }
}