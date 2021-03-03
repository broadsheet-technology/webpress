import { Retrievable } from "./Retrievable";


export interface MediaQuery {
    id?: number
}
export interface Media extends Retrievable<Media> { }
export class Media {
    static route = "media"
    constructor(private media) { }
    get src() {
        return this.media.source_url
    }
    url: string;
}