export class Post {
    constructor(wpapiPost) {
        this.wpapiPost = wpapiPost;
        console.log(wpapiPost);
    }
    static fromList(posts) {
        return posts.map(post => { return new Post(post); });
    }
    get title() {
        return this.wpapiPost.title;
    }
    get subhead() {
        return this.wpapiPost.subhead;
    }
    get featuredMedia() {
        return this.wpapiPost.featured_media;
    }
    get link() {
        return this.wpapiPost.link;
    }
    get content() {
        return this.wpapiPost.content;
    }
}
export class WebMedia {
    constructor(wpmedia) {
        this.wpmedia = wpmedia;
    }
    get url() {
        return this.wpmedia.source_url;
    }
    size() {
    }
}
