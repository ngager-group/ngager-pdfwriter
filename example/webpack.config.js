const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  resolve: {
		alias: {
			fs: 'pdfkit/js/virtual-fs.js'
		}
  },
  watch: true,
  module: {
    rules: [
      { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: 'transform-loader?brfs' },
      { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: 'transform-loader?brfs' },
      { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: 'transform-loader?brfs' },
      { test: /src[/\\]assets/, loader: 'arraybuffer-loader' },
      { test: /\.afm$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    })
  ],
  // devtool: 'sourcemap',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  }
}
