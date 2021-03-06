import { Connection } from "./Connection";
import { Query } from "./Query";

export interface QueryContextual {
    query: Query<any>
}

export class Theme {
    constructor(readonly connection : Connection, readonly definition : Theme.Definition) { }

    async getMenu(_menu : string) {
       // let json = await this.connection.getMenu(this.definition.menus[menu])
       // return new Menu(json)
       return //todo
    }
}

export namespace Theme {
    export interface Definition {
        root : any
        menus : any[] 
        sidebar : any[]
        dir : string
    }
}