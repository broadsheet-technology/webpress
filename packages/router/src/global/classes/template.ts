import { Query } from "@webpress/core"

export interface QueryContextual {
    query: Query
}

export interface TemplateContextual {
    args: TemplateArgs
    query: Query
    hidden: boolean
}

export enum TemplateType {
    FrontPage = 0,
    Search = 1,
    Archive = 2,
    Blog = 3,
    Single = 4,
    PageNotFound = 99
}

export enum TemplateSingleType {
    Page = 0,
    Post = 1,
    Attachment = 2,
    Custom = 3,
    None = 99,
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

export interface TemplateArgs {
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
export class TemplateArgs implements TemplateArgs { 
    constructor(json) {
        this.type = json.type;
        this.singleType = json.singleType;
    }

    matchScore(template: TemplateArgs) {
        if(!template) {
            return -1;
        }
        let score = 0;
        if(template.type === this.type) {
            score += 10
        }

        if(template.singleType && template.singleType !== this.singleType) {
            return -999
        } else if(template.singleType && template.singleType === this.singleType) {
            score += 2
        }
        return score;
    }
}

export class Template {
    query : Query
    args : TemplateArgs

    constructor(json) {
        this.query = json.query
        this.args = new TemplateArgs(json.args)
    }
}
