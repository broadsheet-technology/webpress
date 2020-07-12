import { WebpressObject } from "../object";

export interface MediaQuery {
    id?: number
}
export class Media implements WebpressObject {
    constructor(private media) { }
    get src() {
        return this.media.source_url
    }
    url: string;

}