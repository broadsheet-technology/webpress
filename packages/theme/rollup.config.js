import pkg from './package.json';
import rollupResolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  input: 'dist/index.js',
  plugins: [
    rollupResolve({
      preferBuiltins: true
    }),
    copy({
      targets: [
        { src: "src/www/index.php", dest: "dist/www", options: {verbose: true} },
        { src: "src/www/functions.php", dest: "dist/www" },
        { src: "src/www/etc", dest: "dist/www/" },
      ]
    })
  ],
  external: [
    'fs',
    'path'
  ],
  output: [
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'esm',
      file: pkg.module
    }
  ]
};
