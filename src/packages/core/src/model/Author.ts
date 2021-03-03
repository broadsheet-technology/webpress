import { Retrievable } from "./Retrievable";


export interface AuthorQuery {
    id?: number
}

export interface Author extends Retrievable<Author> { }
export class Author {
    static route = "authors"
    
    constructor(private author) { }
    link: string;
    
    get name() {
        return this.author.name
    }
    get avatarSrc() : string {
        return this.author.avatar_urls["96"]
    }
    url: string;

}