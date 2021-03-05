
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