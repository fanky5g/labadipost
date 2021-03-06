var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxy = require('proxy-middleware');
var config = require('./webpack.config');

var port = +(process.env.PORT || 5000);

if (!Array.isArray(config)) {
  config.entry = {
    bundle: [
      'webpack-hot-middleware/client?http://localhost:' + port,
      config.entry.bundle
    ]
  };

  config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  config.devtool = 'cheap-module-eval-source-map';
} else {
  config.map(cfg => {
    if (cfg.hot) {
      cfg.entry = {
        bundle: [
          'webpack-hot-middleware/client?http://localhost:' + port,
          cfg.entry.bundle,
        ]
      }
    }
  })
}

var app = new require('express')();

var compiler = webpack(config);
if (!Array.isArray(config)) {
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath })); 
} else {
  config.map(cfg => {
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: cfg.output.publicPath }));
  });
}

app.use(webpackHotMiddleware(compiler));
app.use(proxy('http://localhost:' + port));

port++

app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});
