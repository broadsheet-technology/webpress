import { Single, Post } from "./post";

export class Query {
    public posts : Single[]
    constructor(json : any) {
        console.log(json)
        this.posts = json.posts.map((json : any) => new Post(json))
     }
}