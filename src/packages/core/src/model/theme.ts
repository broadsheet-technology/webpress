import { ServerDefinition, Connection } from "./Connection";
import { Query } from "./Query";

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

export interface QueryContextual {
    query: Query<any>
}

export class Theme {
    constructor(readonly connection : Connection, readonly definition : ThemeDefinition) {

    }

    async getMenu(_menu : string) {
       // let json = await this.connection.getMenu(this.definition.menus[menu])
       // return new Menu(json)
       return //todo
    }
}