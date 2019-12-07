import { Single, Post } from "./post";

export class Query {

    get posts() : Promise<Single[]> {
        return new Promise( (resolve, _reject) => {
            let posts = this.json.posts.map(json => new Post(json))
            resolve(posts)
        })
    }

    constructor(readonly connection, private json: any) {

    }

}