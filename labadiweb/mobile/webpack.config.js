var path = require('path');
var webpack = require('webpack');

const PLUGINS = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.optimize.OccurrenceOrderPlugin,
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

module.exports = {
  cache: true,
  watch: true,
  entry: {
    mobile: ['./'],
  },
  output: {
    filename: '[name].js',
    outputPath: './build',
    publicPath: '/mobile/',
  },
  plugins: PLUGINS,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.svg/,
      loader: 'babel!svg-react',
    },],
    postLoaders: [
      { loader: "transform?brfs" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    alias: {
      '#routes': path.join(__dirname, 'routes'),
      '#containers': path.join(__dirname, 'containers'),
      '#node_modules': path.join(__dirname, 'node_modules'),
      '#lib': path.join(__dirname, 'lib'),
      '#common': path.join(__dirname, 'common'),
      '#svg-sprites': path.join(__dirname, 'svg-sprites'),
    },
  },
  devtool: 'source-map'
};
