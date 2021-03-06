import { Query as GenericQuery, QueryArgs as GenericQueryArgs } from "./Query"
import { Connection, Route } from "./Connection"
import { Retrievable } from "./Retrievable"
import { Single } from "./Single"
import { Page } from "./Page"
import { Post } from "./Post"

export interface Template<T extends Single = Single> extends Retrievable<Template> { }
export class Template<T extends Single = Single> implements Retrievable<Template>, Template.Properties {
    constructor(readonly connection: Connection, protected json: Template.JSON) { }

    get globalQuery() : GenericQuery<T> {
        return new GenericQuery(this.connection, Template.GlobalQueryArgs<T>(this.json))
    }

    get type() {
        return this.json.properties.type
    }

    get frontPageType() {
        return this.json.properties.frontPageType
    }

    get isSingle() {
        return this.json.properties.type == Template.Type.Single
    }

    get isFrontPage() {
        return this.json.properties.type == Template.Type.FrontPage
    }
}

export namespace Template {
    export const Resolve = (template : Template, contextuals : Template.Contextual<Single>[]) => {
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

    const matchScore = (template: Template, contextual: Template.Contextual<Single>) => {
        if (!template) {
            return -1
        }
        if (!contextual.definition) {
            console.log("wp-template has no parameters")
            return -99
        }

        let definition = contextual.definition
        let score = 0;
        console.log("template type", template, definition)
        switch (template.type) {
            case Template.Type.Blog: {
                if (definition.type == Template.Type.Blog) {
                    score = 400;
                }
            }
            break;
            case Template.Type.FrontPage: {
                if (template.frontPageType == Template.FrontPageType.Home) {
                    if (definition.type != Template.Type.FrontPage) {
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
            case Template.Type.Single: {
                if (definition.type != Template.Type.Single) {
                    return -999;
                }
                if (definition.singleType && definition.singleType !== definition.singleType) {
                    score = -99
                } 
                else if (definition.singleType != Template.SingleType.None && definition.singleType === definition.singleType) {
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
    export interface QueryParams {
        path,
    }

    export const QueryArgs = (params: QueryParams) => 
        new GenericQueryArgs<Template, QueryParams>(Template, new Route("template"), params)

    export class Query<T extends Single> extends GenericQuery<T> {
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
    
        private templateQuery : GenericQuery<Template>
        get template() : Promise<Template> {
            return this.templateQuery.result
        }
    
        constructor(connection : Connection, args : QueryParams) { 
            super(connection, undefined)
            this.templateQuery = new GenericQuery<Template>(connection, QueryArgs(args))
        }
    }
}

// Global Query

export namespace Template {
    export interface Properties {
        type: Template.Type
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
    
    export const GlobalQueryArgs = <T extends Single>(params: Template.JSON, type : Retrievable<T> = internalTypeFor<T>(params.properties) ) => 
        new GenericQueryArgs<T, Template.JSON>(type, routeForType(params.properties), params.queryArgs)
        
    const internalTypeFor = <T>(properties: Template.Properties) : Retrievable<T> => {
        var type
        switch (properties.type) {
            case Template.Type.Single:
                if (properties.singleType == Template.SingleType.Page) {
                    type = Page
                } else {
                    type = Post
                }
                break;
            default:
                break;
        }
        return type || Post
    }

    const routeForType = (properties: Template.Properties) : Route => {
        var route
        switch (properties.type) {
            case Template.Type.Single:
                if (properties.singleType == Template.SingleType.Page) {
                    route = new Route("page")
                } else {
                    route = new Route("post")
                }
                break;
            default:
                break;
        }
        return route || new Route("page")
    }
}

// Contextuals {
export namespace Template {
    export interface Contextual<T extends Single> {
        definition: Template.Properties
        query: Template.Query<T>
        hidden: boolean
    }
}
// Template Enums

export namespace Template {
    export enum Type {
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