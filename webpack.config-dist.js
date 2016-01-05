'use strict';

var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	plugins: [new webpack.optimize.UglifyJsPlugin()],
	watch: true,
	keepalive: true,
	devtool: "#inline-source-map",
	output: {
		filename: 'index.js',
		path: './dist'
	},
	module: {
		loaders: [{ 
			test: /\.jsx$/, 
			loader: 'jsx' 
		}]
	}
};