import fs from 'fs'
import { Config } from '@stencil/core'

export interface WebpressThemeOptions {
    config: Config,
    name: string,
    themeDir: string
    root: string
    namespace: string
}
export function theme(options : WebpressThemeOptions) {
    return {
        generateBundle(_outputOptions : any, _bundle : { [fileName: string]: any }, _isWrite : boolean) {
            

            const target = options.config.outputTargets.find( target => target.type === 'www') as any
            
            target.copy.push({ src: "style.css" })
            console.log(target)
            
            /* fs.copyFile(__dirname + '/www/functions.php', options.themeDir + 'functions.php', (err: any) => {
                if (err) throw err;
            });  */
        }
    }
}
export function encodeAndCopyFunctions(options : WebpressThemeOptions, _context : any) {
    if(!options.root) {
        throw new Error("Webpress: Must define a root component in options.root")
    }
    //let data
    //data = fs.readFileSync(__dirname + '/www/index.php', "utf8")
    //const indexString = encode(data, new Map([[/%%ROOT%%/g, options.root],[/%%STENCIL_NAMESPACE%%/g, options.namespace]]))
    /* fs.emitFile({
        type: 'asset',
        source: indexString,
        name: 'index.php'
      })
    */
    // fs.writeFileSync(options.themeDir + 'index.php', indexString, "utf8")
}

function encode(str : string, tokens : Map<RegExp,string>) {
    tokens.forEach( (val,key) => {
        str = str.replace(key,val)
    })
    return str
}


export function themeStuff(options: WebpressThemeOptions) {
    return {
        name: 'themeStuff',
        pluginType: 'copy',
        transform(_sourceText: any, fileName :any, _context: any) {
            console.log(fileName);

            let data
            data = fs.readFileSync(__dirname + '/www/index.php', "utf8")
            const indexString = encode(data, new Map([[/%%ROOT%%/g, options.root],[/%%STENCIL_NAMESPACE%%/g, options.namespace]]))
            fs.writeFileSync(options.themeDir + 'index.php', indexString, "utf8")

            return new Promise(resolve => {
                resolve()
            });
        }
    };
}
