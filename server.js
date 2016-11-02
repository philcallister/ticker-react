var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
  historyApiFallback: true
}).listen(3000, 'localhost', function (err, res) {
  err ? console.log(err) : console.log("Listening at localhost:3000")
})