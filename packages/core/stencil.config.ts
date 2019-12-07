import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'core',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    }
  ]
};
