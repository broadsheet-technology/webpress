import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: "webpress-debug",
  srcDir: 'src',
  
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'app',
      dir: "bin",
      copy: [
        { src: 'packages/core/src/theme-overlay/functions.php', dest: 'functions.php'},
        { src: 'packages/core/src/theme-overlay/etc', dest: 'etc' }
      ]
    },
  ]
};

config.plugins = [ 
  sass({injectGlobalPaths: [
    'src/themes/badgerherald.org/src/global/foundations.scss',
  ]})
]

