import { WebpressObject, LinkedObject } from "./object";
import { Author } from "./author";
import { Media } from "./media";

export abstract class Single implements WebpressObject {
    protected constructor(private json: any, private connection) { }
    abstract route: string;

    get title() : string {
        return this.json.title.rendered
    }

    get excerpt() : string {
        return this.json.excerpt.rendered
    }

    get subhead() : string {
        return this.json.subhead
    }

    get featuredMedia() : LinkedObject<Media> {
        return new LinkedObject(Media, this.json.featured_media, this.connection)
    }

    get link() : string {
        return this.json.link
    } 
    
    get author() : LinkedObject<Author> {
        return new LinkedObject(Author, this.json.author, this.connection)
    }    

    get id() : number {
        return parseInt(this.json.ID,10)
    }

    get content() : string {
        return this.json.content.rendered
    }
}