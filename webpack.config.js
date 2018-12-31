const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const {resolve} = require('path');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');


const {ifProduction, ifNotProduction, ifNotTest} = getIfUtils(process.env.NODE_ENV || 'development');

module.exports = {
  devtool: 'source-map',

  // context: resolve('./src'),

  entry: {
    app: './src/api.tsx'
  },
  watch: process.env.NODE_ENV !== 'production',
  output: {
    filename: `FForm${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    path: resolve('./dist'),
    libraryTarget: 'umd',
    library: 'FForm',
  },
  externals: {
    react: 'react',
    'react/addons': 'react/addons',
    redux: 'redux',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
// ./_props-loader!
      {
        test: /\.(ts|tsx)$/,
        loader: `${process.env.NODE_ENV === 'production' ? './_props-loader!babel-loader!' : ''}ts-loader`
      },
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
    ifProduction(new webpack.optimize.minimize({
      sourceMap: process.env.NODE_ENV !== 'production',
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    })),
  ]),
};
