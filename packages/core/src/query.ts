import { Single, Post } from "./post";

export class Query {
    posts : Single[] = []
    constructor(public wpapiQuery: any) {
        if(!wpapiQuery || !wpapiQuery.posts) {
            return
        }
        this.posts = wpapiQuery.posts.map( (post : any) => new Post(post))
    }
}