import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

// @ts-ignore 
import { debug } from './debug.config'

debug == undefined || console.log(debug)

var webpress = debug && debug.themeSrc != undefined ? debug : {
  themeSrc: "packages/starter/src/",
  themeDir: "server/wp-content/themes/",
  namespace: 'webpress'
}

export const config: Config = {
  namespace: webpress.namespace,
  srcDir: 'src',
  excludeSrc: ["**/*.js","node_modules","**/node_modules/**","**/node_modules/*","**/.**","**/dist/**","**/stencil.config.ts", "**/*.d.ts"],
  
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'app',
      dir: webpress.themeDir + webpress.namespace,
      copy: [
        { src: webpress.themeSrc + 'style.css', dest: 'style.css' },
        { src: webpress.themeSrc + 'index.php', dest: 'index.php' },
        { src: webpress.themeSrc + 'theme-definition.json' },
        { src: 'packages/core/src/theme-overlay/functions.php', dest: 'functions.php'},
        { src: 'packages/node_modules/@webpress/core/src/theme-overlay/etc', dest: 'etc'}
      ]
    },
  ]
};

config.plugins = [ 
  sass({injectGlobalPaths: [
    'src/themes/badgerherald.org/src/global/foundations.scss',
  ]})
]

