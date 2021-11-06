import { Media } from "./Media";
import { Author } from "./Author";
import { Linked } from "./Linked";
import { Queryable } from "..";

export abstract class Single<T extends Single<any> = Single<any>> extends Queryable<T> {
    get title() : string {
        return this.response.json.title.rendered
    }

    get excerpt() : string {
        return this.response.json.excerpt.rendered
    }

    get subhead() : string {
        return this.response.json.subhead
    }

    get featuredMedia() : Media.Query {
        return Linked.Query(this.response.connection, Linked.QueryArgs<Media>(Media, this.response.json.featured_media))
    }

    get date() : Date {
        return new Date(this.response.json.date)
    }

    get link() : string {
        return this.response.json.link
    } 
    
    get author() : Author.Query {
        return Linked.Query(this.response.connection, Linked.QueryArgs<Author>(Author, this.response.json.author))
    }    

    get id() : number {
        return parseInt(this.response.json.ID,10)
    }

    get content() : string {
        return this.response.json.content.rendered
    }
}
