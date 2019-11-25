import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import { theme } from '@webpress/theme'

export const config: Config = {
  namespace: 'webpress',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'app',
      dir: '../../../webpress.test/wp.test/wp/wp-content/themes/webpress/',
      copy: [
        { src: "style.css" }
      ]
    }
  ],
  plugins: [ 
    sass({}),
    theme({
      name: "Webpress Demo",
      root: "wp-root",
      namespace: "webpress",
      themeDir: "../../../webpress.test/wp.test/wp/wp-content/themes/webpress/"
    })
  ]
};
