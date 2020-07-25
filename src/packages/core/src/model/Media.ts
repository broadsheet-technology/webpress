import { WebpressObject } from "./object";

export interface MediaQuery {
    id?: number
}
export class Media implements WebpressObject {
    readonly route = "Media"
    constructor(private media) { }
    link: string;
    get src() {
        return this.media.source_url
    }
    url: string;

}