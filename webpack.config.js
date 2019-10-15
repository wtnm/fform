const webpack = require('webpack');
const {resolve} = require('path');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');


module.exports = (env, argv) => {
  const {ifProduction} = getIfUtils(argv.mode || 'development');
  //console.log(JSON.stringify(argv));
  let externals = {react: 'React'};
  let {entryFile = 'fform', dstDir = './dist', srcDir = './src'} = argv;
  if (entryFile === 'sample') {
    srcDir = './sample';
    dstDir = './sample/build';
    externals = {};
  }
  return {
    stats: {
      colors: true
    },
    devtool: 'source-map',
    entry: {
      app: `${srcDir}/${entryFile}.tsx`
    },
    watch: argv.mode !== 'production',
    output: {
      filename: `${entryFile}${argv.mode === 'production' ? '.min' : '.dev'}.js`,
      path: resolve(dstDir),
      libraryTarget: 'umd',
      library: entryFile,
    },
    externals: externals,
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'babel-loader'
          //loader: `${argv.mode === 'production' ? 'babel-loader!' : ''}ts-loader`,
        },
        {
          test: /\.css$/i,
          use: ['basicStyling-loader', 'css-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: removeEmpty([
      ifProduction(new webpack.optimize.OccurrenceOrderPlugin(true))
    ])
  };
};

