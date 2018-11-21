const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const {resolve} = require('path');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const {ifProduction, ifNotProduction, ifNotTest} = getIfUtils(process.env.NODE_ENV || 'development');

module.exports = {
  devtool: 'source-map',

  // context: resolve('./src'),

  entry: {
    app: './src/constructor.tsx'
  },
  watch: process.env.NODE_ENV !== 'production',
  output: {
    filename: `constructor${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    path: resolve('./dist'),
    libraryTarget: 'umd',
    library: 'constructor',
  },
  module: {

    rules: [{
      test: /\.(js|jsx)$/, // include .js files
      //enforce: "pre", // preload the jshint loader
      exclude: /node_modules/, // exclude any and all files in the node_modules folder
      loader: "babel-loader"
    },
      {
        test: /\.(ts|tsx)$/,
        loader: `${process.env.NODE_ENV === 'production' ? './props-loader!babel-loader!' : ''}ts-loader`
      },
      {
        test: /\.scss$/,
        loader: `style-loader!css-loader?importLoaders=1&sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap`,
      },
      {
        test: /\.css$/,
        loader: `style-loader!css-loader?importLoaders=1!postcss-loader`,
      }

    ],

//
//     loaders: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         loaders: ['babel-loader']
//       },
// // ./props-loader!
//
//     ],
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
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: process.env.NODE_ENV !== 'production'
      }
      // {
      //   sourceMap: process.env.NODE_ENV !== 'production',
      //   compress: {
      //     screw_ie8: true,
      //     warnings: false,
      //   },
      //   mangle: {
      //     screw_ie8: true,
      //   },
      //   output: {
      //     comments: false,
      //     screw_ie8: true,
      //   },
      // }
    )),
  ]),
};
