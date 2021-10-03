import { Connection } from "./Connection";
import { Retrievable } from "./Retrievable";

export interface Author extends Retrievable<Author> { }
export class Author {
    constructor(readonly connection: Connection, protected json: any) { }
    
    link: string;
    
    get name() {
        return this.json.name
    }
    get avatarSrc() : string {
        return this.json.avatar_urls["96"]
    }
    url: string;

}