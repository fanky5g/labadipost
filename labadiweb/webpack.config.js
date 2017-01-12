const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const publicPath = '/static/build/';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const PLUGINS = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PUBLIC_PATH: JSON.stringify(publicPath),
    },
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
  new webpack.optimize.OccurrenceOrderPlugin,
  new webpack.optimize.DedupePlugin(),
  new ExtractTextPlugin({
    filename: 'style.css',
    disable: false,
    allChunks: true,
  }),
  new CopyWebpackPlugin([{
    from: path.resolve('./client/static'),
  }], {}),
];

if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
    output: {
      comments: false,
    },
  }));
}

const BABEL_QUERY = {
  presets: ['react', 'es2015', 'stage-0'],
  plugins: ['transform-runtime'],
};

const config = [{
  cache: false,
  entry: {
    bundle: path.join(__dirname, '/client'),
  },
  output: {
    path: path.join(__dirname, 'server/data/static/build'),
    publicPath: '/static/build/',
    filename: '[name].js',
  },
  plugins: PLUGINS,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: BABEL_QUERY,
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader' }),
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' }),
    }, {
      test: /\.gif$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        mimetype: 'image/gif',
      },
    }, {
      test: /\.jpg$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        mimetype: 'image/jpg',
      },
    }, {
      test: /\.png$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        mimetype: 'image/png',
      },
    }, {
      test: /\.svg/,
      loader: 'url-loader',
      query: {
        limit: 26000,
        mimetype: 'image/svg+xml',
      },
    }, {
      test: /\.(woff|woff2|ttf|eot)/,
      loader: 'url-loader',
      query: {
        limit: 100000,
      },
    }],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '#containers': path.join(__dirname, 'client/containers'),
      '#common': path.join(__dirname, 'client/common'),
      '#lib': path.join(__dirname, 'client/lib'),
      '#routes': path.join(__dirname, 'client/routes'),
      '#styles': path.join(__dirname, 'client/styles'),
    },
  },
}];

module.exports = config;
