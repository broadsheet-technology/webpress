

export interface ServerDefinition {
    apiUrl : string
}

export class WebpressConnection {
    constructor(readonly server : ServerDefinition) {

    }

    loadPost(_post : string) {
        // todo...
    }
}