import { Connection, Route } from "./Connection"
import { Retrievable } from "./Retrievable"
import { Single } from "./Single"
import { Page } from "./Page"
import { Post } from "./Post"
import { Queryable, Query as InternalQuery } from ".."

export class Template<T extends Single> extends Queryable<Template<T>> implements Template.Properties {
    static QueryArgs = (params: Template.Args) => InternalQuery.ArgBuilder(Template, params);
    static Route = () => Connection.RouteBuilder("media");

    get globalQuery() : Global.Query<T> {
        return //new Global.Query(this.response.connection, new Global.QueryArgs(this.json))
    }

    get type() {
        return this.response.json.properties.type
    }

    get frontPageType() {
        return this.response.json.properties.frontPageType
    }

    get isSingle() {
        return this.response.json.properties.type == Template.TemplateType.Single
    }

    get isFrontPage() {
        return this.response.json.properties.type == Template.TemplateType.FrontPage
    }

    get slug() {
        return this.response.json.properties.slug
    }

    get singleType() {
        return this.response.json.properties.singleType
    }
}
/*
export namespace Global {
    export class Query<T extends Single> extends Query<T, Template.JSON> { }

    export class QueryArgs<T extends Single> extends QueryArgs<T> {
        constructor(params: Template.JSON, type : Retrievable<T> = typeForProperties<T>(params.properties)) {
            super(type, routeForType(params.properties), params.queryArgs)
        }
    }
}
*/
export namespace Template {
    export const Resolve = (template : Template, contextuals : Template.Contextual[]) => {
        var bestMatch = {
            element: undefined, 
            score: 0
        }

        contextuals.map(contextual => {
            let score = matchScore(template, contextual)
            console.log("scoring...", contextual, score)
            if (score > bestMatch.score) {
                bestMatch = {
                    score: score,
                    element: contextual
                }
            }
        })

        return bestMatch.element
    }

    const matchScore = (template: Template, contextual: Template.Contextual) => {
        if (!template) {
            return -1
        }
        if (!contextual.definition) {
            return -99
        }

        let definition = contextual.definition
        let score = 0;

        switch (template.type) {
            case Template.TemplateType.Blog: {
                if (definition.type == Template.TemplateType.Blog) {
                    score = 400;
                }
            }
            break;
            case Template.TemplateType.FrontPage: {
                if (template.frontPageType == Template.FrontPageType.Home) {
                    if (definition.type != Template.TemplateType.FrontPage) {
                        score = -999
                    } else if(definition.frontPageType && definition.frontPageType == template.frontPageType) {
                        score = 40;
                    }
                } else if(template.frontPageType == Template.FrontPageType.Page) {
                    if (definition.singleType && definition.singleType == Template.SingleType.Page) {
                        score = 40;
                    }
                    else if (definition.frontPageType == Template.FrontPageType.Page) {
                        score = 60;
                    }
                }
            }
            break;
            case Template.TemplateType.Single: {
                if (definition.type != Template.TemplateType.Single) {
                    return -999;
                }
                if (definition.singleType && definition.singleType !== definition.singleType) {
                    score = -99
                } 
                else if (definition.singleType != Template.SingleType.None && definition.singleType === template.singleType) {
                    score = 20
                }
                else {
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

// Template Query

export namespace Template {
    export type Args = {
        path,
    }
    
    export class Query<T extends Single = Single> extends InternalQuery<T> {
        constructor(connection : Connection, args : Template.Args) { 
            super(connection, undefined)
            this.templateQuery = new TemplateQuery(connection, new QueryArgs(args))
        }

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
    
        private templateQuery : TemplateQuery
        get template() : Promise<Template> {
            return this.templateQuery.result
        }
    }

    class TemplateQuery extends Query<Template> { }
}

// Global Query

export namespace Template {
    export interface Properties {
        type: Template.TemplateType
        singleType?: Template.SingleType
        frontPageType?: Template.FrontPageType
        archiveType?: Template.ArchiveType 
        archiveDateType?: Template.ArchiveDateType 

        slug?: string
        postType?: string
        nicename?: string
        id?: string
        taxonomy?: string 
        taxonomyTerm?: string
    }
 
    export interface JSON {
        properties : Properties,
        queryArgs : any
    }
}

// Contextuals 

export namespace Template {
    export interface Contextual {
        definition: Template.Properties
        query: Template.Query
        hidden: boolean
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
        PageNotFound = 0
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
        Tag
    }
    
    export enum ArchiveDateType {
        None,
        Year,
        Month,
        Day
    }
}



const typeForProperties = <T>(properties: Template.Properties) : Retrievable<T> => {
    var type
    switch (properties.type) {
        case Template.TemplateType.FrontPage:
            type = typeForFrontPage(properties.frontPageType)
        case Template.TemplateType.Single:
            if (properties.singleType == Template.SingleType.Page) {
                type = Page
            } else {
                type = Post
            }
            break;
        case Template.TemplateType.Blog:
            type = Post
        default:
            break;
    }
    return type || Post
}

const typeForFrontPage = <T>(frontPageType : Template.FrontPageType) : Retrievable<T> => {
    var type
    switch (frontPageType) {
        case Template.FrontPageType.Home:
            type = Post
        case Template.FrontPageType.Page:
            type = Page
    }
    return type
}

const routeForType = (properties: Template.Properties) : Route => {
    var route
    switch (properties.type) {
        case Template.TemplateType.FrontPage:
            route = routeForFrontPage(properties.frontPageType)
        case Template.TemplateType.Single:
            if (properties.singleType == Template.SingleType.Page) {
                route = new Route("page")
            } else {
                route = new Route("post")
            }
            break;
        case Template.TemplateType.Blog:
            route = new Route("post")
        default:
            break;
    }
    return route || new Route("page")
}

const routeForFrontPage = <T>(frontPageType : Template.FrontPageType) : Retrievable<T> => {
    var type
    switch (frontPageType) {
        case Template.FrontPageType.Home:
            type = new Route("post")
        case Template.FrontPageType.Page:
            type = new Route("page")
    }
    return type
}