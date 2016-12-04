var path = require('path');

module.exports = {
  cache: true,
  watch: true,
  entry: {
    mobile: ['./'],
  },
  output: {
    filename: '[name].js',
    outputPath: './build'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, ],
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
    },
  },
  devtool: 'source-map'
};
