import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: 'webpress',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'app',
      dir: '../../../webpress.test/wp.test/wp/wp-content/themes/webpress/',
      copy: [
        { src: 'style.css' },
        { src: 'index.php' },
        { src: 'theme-definition.json' },
        { src: '../node_modules/@webpress/theme/dist/www/functions.php', dest: 'functions.php'},
        { src: '../node_modules/@webpress/theme/dist/www/etc', dest: 'etc'}
      ]
    }
  ]
};

config.plugins = [ 
  sass({})
  /* todo: copy index.php, functions.php inside the theme plugin
  theme({
    config: config,
    name: "Webpress Demo",
    root: "wp-root",
    namespace: "webpress",
    themeDir: "../../../webpress.test/wp.test/wp/wp-content/themes/webpress/"
  })
  */
]

