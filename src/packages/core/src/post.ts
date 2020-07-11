import WPAPI from 'wpapi'
import { WebpressObject } from './object'

export interface Single extends WebpressObject {
    readonly title: string 
    readonly subhead: string 
    readonly featuredMedia: number 
    readonly content: string 
    readonly id: number
}

export class Post implements Single {
    constructor(private wpapiPost?: any) { }
    
    static fromList(posts : WPAPI.WPRequest[]) {
        return posts.map(post => {return new Post(post)})
    }

    get title() : string {
        return this.wpapiPost.title.rendered
    }

    get subhead() : string {
        return this.wpapiPost.subhead
    }

    get featuredMedia() : number {
        return this.wpapiPost.featured_media
    }

    get url() : string {
        return this.wpapiPost.link
    }    

    get id() : number {
        return parseInt(this.wpapiPost.ID,10)
    }

    get content() : string {
        return this.wpapiPost.content.rendered
    }
}

export class WebMedia {
    readonly author: string ;
    
    constructor(private wpmedia?: any) { }

    get url() {
        return this.wpmedia.source_url
    }

    size() {

    }
}
