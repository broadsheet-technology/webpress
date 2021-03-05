import { Query, QueryArgs } from "./Query"
import { Connection, Route } from "./Connection"
import { Page } from "./Page"
import { Retrievable } from "./Retrievable"
import { Single } from "./Single"

export interface TemplateContextual {
    args: SingleTemplateQueryArgs
    query: Query<Single>
    hidden: boolean
}

export enum TemplateType {
    FrontPage = 1,
    Search = 2,
    Archive = 3,
    Blog = 4,
    Single = 5,
    PageNotFound = 0
}

export enum TemplateSingleType {
    Page = 1,
    Post = 2,
    Attachment = 3,
    Custom = 4,
    None = 0,
}

export enum TemplateFrontPageType {
    Home = 1,
    Page = 2,
    None = 0,
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

export interface TemplateParams {
    templateType: TemplateType
    singleType?: TemplateSingleType
    frontPageType?: TemplateFrontPageType
    archiveType?: TemplateArchiveType 
    archiveDateType?: TemplateArchiveDateType 

    slug?: string
    postType?: string
    nicename?: string
    id?: string
    taxonomy?: string 
    taxonomyTerm?: string
}
export class SingleTemplateQueryArgs extends QueryArgs<Single> implements TemplateParams { 
    frontPageType? = TemplateFrontPageType.None
    singleType? = TemplateSingleType.None

    templateType: TemplateType
    archiveType?: TemplateArchiveType 
    archiveDateType?: TemplateArchiveDateType 

    slug?: string
    postType?: string
    nicename?: string
    id?: string
    taxonomy?: string 
    taxonomyTerm?: string

    constructor(readonly params) {
        super(Page, new Route("page"))
        this.templateType = params.type
        this.singleType = params.singleType ? params.singleType : TemplateSingleType.None
        this.frontPageType = params.frontPageType ? params.frontPageType : TemplateFrontPageType.None
    }

    matchScore(template: TemplateParams) {
        if(!template) {
            return -1
        }

        let score = 0;
        
        switch (this.templateType) {
            case TemplateType.Blog: {
                if(template.templateType == TemplateType.Blog) {
                    score = 400;
                }
            }
            case TemplateType.FrontPage: {
                if (this.frontPageType == TemplateFrontPageType.Home) {
                    if(template.templateType != TemplateType.FrontPage) {
                        score = -999
                    } else if(template.frontPageType && template.frontPageType == this.frontPageType) {
                        score = 40;
                    }
                } else if(this.frontPageType == TemplateFrontPageType.Page) {
                    if(template.templateType == TemplateType.Single && template.singleType && template.singleType == TemplateSingleType.Page) {
                        score = 40;
                    }
                    else if(template.frontPageType) {
                        score = 60;
                    }
                }
            }
            break;
            case TemplateType.Single: {
                if(template.templateType != TemplateType.Single) {
                    return -999;
                }
                if(template.singleType && template.singleType !== this.singleType) {
                    score = -99
                } else if(template.singleType != TemplateSingleType.None && template.singleType === this.singleType) {
                    score = 20
                } else {
                    score = 10
                }
            }
            break;
            default:
                score = -99
            break;
        }
        return score;
    }
}

export interface Template extends Retrievable<Template> { }
export class Template implements Retrievable<Template> {
    args : SingleTemplateQueryArgs
    request : any
    link: string

    constructor(readonly connection: Connection, json: any) { 
        this.args = new SingleTemplateQueryArgs(json.args)
        this.request = json.request
    }

    get globalQuery() : Query<Single> {
        return new Query(this.connection, new SingleTemplateQueryArgs(this.args))
    }
}



interface TemplateQueryArgParams {
    path: String
}

export class TemplateQueryArgs extends QueryArgs<Template, TemplateQueryArgParams> {
    constructor(readonly params) { 
        super(Template, new Route("template"))
    }
}

export class TemplateQuery<T> extends Query<T> {
    get params() {
        return this.templateQuery.result.then(template => template.globalQuery)
    }

    private globalQuery : Query<T>
    get results() : Promise<T[]> {
        return new Promise(async (resolve) => {
            let template = await this.templateQuery.result
            if (!this.globalQuery) {
                this.globalQuery = template.globalQuery as unknown as Query<T>
            }
            resolve(this.globalQuery.results)
        })
    }
    get result() : Promise<T> {
        return this.results.then(results => results[0])
    }

    private templateQuery : Query<Template>
    get template() : Promise<Template> {
        return this.templateQuery.result
    }

    constructor(connection : Connection, args : TemplateQueryArgs) { 
        super(connection, undefined)
        this.templateQuery = new Query<Template>(connection, args)
    }
}

