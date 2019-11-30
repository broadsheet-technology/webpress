import { Query } from "@webpress/core"

export interface QueryContextual {
    query: Query
}

export interface TemplateContextual {
    match: TemplateMatch
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
    query : Query

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

    constructor(json) {
        this.query = new Query(json.query)
        this.type = json.match.type;
        this.singleType = json.match.singleType;
    }

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
