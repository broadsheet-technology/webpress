import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'starter',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      buildDir: 'app',
      dir: './../../../bin/wp-content/themes/starter/',
      copy: [
        { src: 'style.css' },
        { src: 'index.php' },
        { src: 'theme-definition.json' },
        { src: './../../../packages/core/dist/collection/theme-overlay/functions.php', dest: 'functions.php'},
        { src: './../../../packages/core/dist/collection/theme-overlay/etc', dest: 'etc'}
      ]
    }
  ],
  plugins: [ sass() ]
};
