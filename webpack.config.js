const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const {resolve} = require('path');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const {ifProduction, ifNotProduction, ifNotTest} = getIfUtils(process.env.NODE_ENV || 'development');

module.exports = {
  stats: {
    colors: true
  },
  devtool: 'source-map',

  // context: resolve('./src'),

  entry: {
    app: './src/components.tsx'
  },
  watch: process.env.NODE_ENV !== 'production',
  output: {
    filename: `fform${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    path: resolve('./dist'),
    libraryTarget: 'umd',
    library: 'fform',
  },
  externals: {
    react: 'react',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: `${process.env.NODE_ENV === 'production' ? 'babel-loader!' : ''}ts-loader` //./props-loader!
      },
      {
        test: /\.css$/,
        loader: `style-loader!css-loader?importLoaders=1!postcss-loader`,
      }
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: removeEmpty([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    ifProduction(new webpack.optimize.OccurrenceOrderPlugin(true)),
    ifProduction(new UglifyJsPlugin(
      {
        cache: true,
        parallel: true,
        uglifyOptions: {
          toplevel: true,
          // nameCache: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: false
      }
    )),
  ]),
};
