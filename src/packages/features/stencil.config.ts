import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'webpressfeatures',
  tsconfig: "tsconfig.stencil.json",
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'theme-overlay' },
      ]
    }
  ]
};
