import { ServerDefinition, WebpressConnection } from "./connection";
import { Menu } from './menu'

export interface ThemeDefinition {
    menus : any[] 
    sidebar : any[]
    dir : string
}

export interface WebpressContext {
    root : string 
    server : ServerDefinition
    theme : ThemeDefinition
}

export class Theme {
    constructor(private connection : WebpressConnection, readonly definition : ThemeDefinition) {

    }

    async getMenu(menu : string) {
        let json = await this.connection.getMenu(this.definition.menus[menu])
        return new Menu(json)
    }
}