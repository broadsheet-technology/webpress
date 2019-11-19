import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'webpressrouter',
  outputTargets: [
    {
      type: 'dist',
      /*
      copy: [
        { src: "index.php", dest: "../www/index.php" },
        { src: "functions.php", dest: "../www/functions.php" }
      ]
      */
    },
  ]
};


