import { WebpressObject, } from "./object";

export interface AuthorQuery {
    id?: number
}
export class Author implements WebpressObject {
    constructor(private author) { }
    link: string;
    route = "Authors"
    get name() {
        return this.author.name
    }
    get avatarSrc() : string {
        return this.author.avatar_urls["96"]
    }
    url: string;

}