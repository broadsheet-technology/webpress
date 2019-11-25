import fs from 'fs';

export interface WebpressThemeOptions {
    name: string,
    themeDir: string
    root: string
    namespace: string
}
export function theme(options : WebpressThemeOptions) {
    return {
        buildEnd() {
            console.log("!!")
            encodeAndCopyFunctions(options)
            fs.copyFile(__dirname + '/www/functions.php', options.themeDir + 'functions.php', (err) => {
                if (err) throw err;
            }); 
        }
    }
}
function encodeAndCopyFunctions(options : WebpressThemeOptions) {
    if(!options.root) {
        throw new Error("Webpress: Must define a root component in options.root")
    }
    let data
    data = fs.readFileSync(__dirname + '/www/index.php', "utf8")
    const indexString = encode(data, new Map([[/%%ROOT%%/g, options.root],[/%%STENCIL_NAMESPACE%%/g, options.namespace]]))
    fs.writeFileSync(options.themeDir + 'index.php', indexString, "utf8")
}

function encode(str : string, tokens : Map<RegExp,string>) {
    tokens.forEach( (val,key) => {
        str = str.replace(key,val)
    })
    return str
}
