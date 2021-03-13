import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: "webpress-debug",
  srcDir: 'src/local-app',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'wp-content/themes/webpress-starter',
      dir: "bin",
      copy: [
        { src: 'starter/style.css' },
        { src: 'starter/index.php' },
        { src: 'starter/theme-definition.json' },
        { src: 'core/theme-overlay/functions.php', dest: 'functions.php'},
        { src: 'core/theme-overlay/etc', dest : 'etc' }
      ]
    },
  ]
};

config.plugins = [ 
  sass({injectGlobalPaths: [
    'src/themes/badgerherald.org/src/global/foundations.scss',
  ]})
]

