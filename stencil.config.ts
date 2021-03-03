import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

var webpress = {
  themeSrc: "packages/starter/src/",
  themeDir: "wp-content/themes/",
  namespace: 'webpress'
}

export const config: Config = {
  namespace: webpress.namespace,
  srcDir: 'src',
  
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'app',
      dir: webpress.themeDir + webpress.namespace,
      copy: [
      //  { src: webpress.themeSrc + 'style.css', dest: 'style.css' },
      //  { src: webpress.themeSrc + 'index.php', dest: 'index.php' },
      //  { src: webpress.themeSrc + 'theme-definition.json' },
        { src: 'packages/core/src/theme-overlay/functions.php', dest: 'functions.php'},
        { src: 'packages/core/src/theme-overlay/etc', dest: 'etc'}
      ]
    },
  ]
};

config.plugins = [ 
  sass({injectGlobalPaths: [
    'src/themes/badgerherald.org/src/global/foundations.scss',
  ]})
]

