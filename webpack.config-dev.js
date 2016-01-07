'use strict';

var webpack = require('webpack');

module.exports = {
	entry: './demo/index.jsx',
	plugins: [new webpack.HotModuleReplacementPlugin()],
	watch: true,
	keepalive: true,
	devtool: "#inline-source-map",
	output: {
		filename: 'demo/bundle.js'
	},
	module: {
		loaders: [{ 
			test: /\.jsx$/, 
			loader: 'jsx' 
		}]
	}
};