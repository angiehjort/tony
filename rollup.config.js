const path = require('path');

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';
import trash from 'rollup-plugin-delete';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default 
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'tony',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      trash({
        targets: ['build/*']
      }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      copy({
        targets: [{
          src: [
            "src/index.html", 
            "src/style.css", 
            "node_modules/d3/dist/d3.min.js"
          ],
          dest: "build"
        },{
          src: "assets/",
          dest: "build/"
        }]
      }),
      serve('build'),
      livereload({ 
        delay: 500, 
        watch: 'build', 
        exts: [ 'html', 'js', 'scss', 'sass', 'css' ] 
      })
    ]
  };

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
//  {
//    input: 'src/main.js',
//    external: ['ms'],
//    output: [
//      { file: pkg.main, format: 'cjs' },
//      { file: pkg.module, format: 'es' }
//    ]
//  }
;


