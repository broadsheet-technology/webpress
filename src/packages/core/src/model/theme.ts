import { Connection } from "./Connection";
import { Menu } from "./Menu";
import { Query } from "./Query";

export interface QueryContextual {
    query: Query<any>
}

export class Theme {
    constructor(readonly connection : Connection, readonly definition : Theme.Definition) { }

    /// Deprecated:
    getMenu(menu : string) : Query<Menu> {
       return new Query(this.connection, Menu.QueryArgs({ id: this.definition.menus[menu] }))
    }
}

export namespace Theme {
    export interface Definition {
        root : any
        menus : Map<string, number>
        sidebar : any[]
        dir : string
    }
}