'use strict';

module.exports = {
	entry: './src/index.js',
	watch: true,
	keepalive: true,
	devtool: "#inline-source-map",
	output: {
		filename: 'index.js',
		path: './dist',
		publicPath: '/dist/'
	},
	module: {
		loaders: [{ 
			test: /\.jsx$/, 
			loader: 'jsx' 
		}]
	}
};