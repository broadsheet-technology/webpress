import { TemplateType, TemplateFrontPageType } from "./template";
import { Single, Template } from ".";
import { WebpressObject } from "./object";

export enum MenuItemType {
    Page,
    Custom,
    Unknown
}

export class MenuItem implements WebpressObject {
    get title() : string {
        return this.json.title
    }
    get url() : string {
        return this.json.url
    }

    isActive(post : Single, template: Template) : boolean {
        if(this.type == MenuItemType.Page) {
            let matchesPage = template.args.type == TemplateType.Single && this.objectId == post.id
            let matchesHomepage = template.args.type == TemplateType.FrontPage && template.args.frontPageType == TemplateFrontPageType.Page && this.objectId == post.id
            return matchesHomepage || matchesPage
        }
        return false
    }

    get type() : MenuItemType {
        switch (this.json.type) {
            case "post_type":
                if(this.json.type_label === "Page") {
                    return MenuItemType.Page
                }
            case "custom":
                return MenuItemType.Custom
            default:
                return MenuItemType.Unknown
        }
    }

    get objectId() : number {
        return parseInt(this.json.object_id,10)
    }

    constructor(private json : any) { }
}

export class Menu {
    readonly items : MenuItem[]
    constructor(private json : any) {
        this.items = [...this.json.items].map( json => new MenuItem(json) )
    }
}