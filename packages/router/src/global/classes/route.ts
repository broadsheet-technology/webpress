export class RouteMatch {
    
    constructor(readonly route: Route, readonly match: RegExpMatchArray) {

    }

    // all params
    get params() : URLSearchParams {
        let queryURL = this.route.indexString
        queryURL = queryURL.replace("index.php","")
        this.match.map((piece,index) => queryURL = queryURL.replace("\$matches["+index+"]",piece && piece.replace(/^\/|\/$/g, '').length > 0 ? piece.replace(/^\/|\/$/g, '') : ""))
        return new URLSearchParams(queryURL)
    }

    get paramCount() {
        return this.route.paramCount
    }

    get nunnullMatchCount() {
        return this.match.filter(match => (match || "").replace(/^\/|\/$/g, '').length > 0).length
    }

    get allMatchCount() {
        return this.match.length
    }
}

export class Route {

    constructor(readonly indexString:string, readonly regex: string) { }

    public match(path : string) {
        var lastChar = path.substr(-1); 
        if (lastChar != '/') {
            path = path + '/';
        }
        const match = path.match(this.regex)
        if(match && match.length > 0) {
            return new RouteMatch(this,match)
        }
    }

    public paramCount() {
        const count = (str) => {
            const re = /\$matches\[[0-9]+\]/g
            return ((str || '').match(re) || []).length
        }
        return count(this.indexString)
    }
}

export class RouteFactory {
    private routes : Route[] = []
    constructor(routes : Map<string,string>) {
        routes.forEach((indexString,regex) => {
            this.routes.push(new Route(indexString,regex))
        })
    }

    routesForPath(path : string) {
        const routeMatches = []
        this.routes.forEach(route => {
            const match = route.match(path)
            if(match !== undefined) {
                routeMatches.push(match)
            }
        })
        return routeMatches
    }

    bestMatches(matches : RouteMatch[]) : RouteMatch[] {

        console.log("matches",matches)
        return matches;
        /*
        // First, greedily try to maximize the number of url parameters each match found nunnull pieces for.
        let mostMatches : RouteMatch[] = []
        matches.forEach(match => {
            if(mostMatches.length > 0) {
                if(mostMatches[0].nunnullMatchCount == match.nunnullMatchCount) {
                    mostMatches.push(match)
                } else if(mostMatches[0].nunnullMatchCount < match.nunnullMatchCount) {
                    mostMatches = []
                    mostMatches.push(match)
                }
            } else {
                mostMatches.push(match)
            }
        });

        console.log("matches",mostMatches)
        return mostMatches
        /*
        // If only one (or no) results were found, return
        if(mostMatches.length <= 1) {
            
        }

        // Otherwise, find the best match
        let fewestUnmatchedParams = []
        let smallestSoFarUnmatchedParameterCount = 9999999
        if(mostMatches.length > 1) {
            mostMatches.map(match => {
                if(fewestUnmatchedParams.length > 0) {
                    const unmatchedParameterCount = match.allMatchCount - match.nunnullMatchCount
                    if(unmatchedParameterCount == smallestSoFarUnmatchedParameterCount) {
                        fewestUnmatchedParams.push(match)
                    } else {
                        fewestUnmatchedParams = []
                        fewestUnmatchedParams.push(match)
                        smallestSoFarUnmatchedParameterCount = unmatchedParameterCount
                    }
                } else {
                    fewestUnmatchedParams.push(match)
                }
            })
        }
        
        return mostMatches // Returns most matches. Problems with page slugs that include '/'...
        */
    }
}