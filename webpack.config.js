const path = require('path');
// const webpack = require('webpack');
const base = require('./webpack.baseconfig');

const config = {
  // Bundle the JavaScript emitted by tsc into ./dist instead of transpiling
  // TypeScript sources directly: ts-loader depends on the TypeScript JS API,
  // which typescript@7 (native compiler) does not provide. Run `pnpm run tsc`
  // before webpack (the `build` script does this).
  entry: ['./dist/index.js'],

  output: {
    filename: `${base.libName}.bundle.js`,
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: path.resolve(__dirname, './dist'),
    library: base.libName,
    libraryTarget: 'umd',
    globalObject: 'this' // for node js import
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
    fallback:{
      'crypto': false
    }
  }
};

module.exports = (env, argv) => {
  config.mode = (typeof argv.mode !== 'undefined' && argv.mode === 'production') ? argv.mode : 'development';

  if (config.mode === 'production') console.log('Webpack for production');
  else{
    console.log('Webpack for development');
    config.devtool = 'inline-source-map'; // add inline source map
  }

  return config;
};
