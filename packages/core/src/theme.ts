import { ServerDefinition, WebpressConnection } from "./connection";
import { Menu } from './menu'

export interface ThemeDefinition {
    menus : any[] 
    sidebar : any[]
}

export interface WebpressContext {
    root : string 
    server : ServerDefinition
    theme : ThemeDefinition
}

export class Theme {
    constructor(readonly definition : ThemeDefinition, private connection : WebpressConnection) {

    }

    async getMenu(menu : string) {
        let json = await this.connection.getMenu(this.definition.menus[menu])
        return new Menu(json)
    }
}