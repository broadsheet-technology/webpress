import { ServerDefinition } from "./connection";

export interface ThemeDefinition {
    menus : any[] 
    sidebar : any[]
}

export interface WebpressContext {
    root : string 
    server : ServerDefinition
    theme : ThemeDefinition
}