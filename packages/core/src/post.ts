import WPAPI from 'wpapi'

export interface Single {
    readonly title: string 
    readonly subhead: string 
    readonly featuredMedia: number 
    readonly link : string 
    readonly content: string 
}

export class Post implements Single {
    constructor(private wpapiPost?: any) { }
    
    static fromList(posts : WPAPI.WPRequest[]) {
        return posts.map(post => {return new Post(post)})
    }

    get title() : string {
        return this.wpapiPost.post_title
    }

    get subhead() : string {
        return this.wpapiPost.subhead
    }

    get featuredMedia() : number {
        return this.wpapiPost.featured_media
    }

    get link() : string {
        return this.wpapiPost.link
    }    

    get content() : string {
        return this.wpapiPost.content as any
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

