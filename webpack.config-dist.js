'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	plugins: [new webpack.optimize.UglifyJsPlugin(), new webpack.optimize.DedupePlugin()],
	output: {
		filename: 'dist/index.js',
		libraryTarget: 'umd',
		library: 'HomerReactScroller'
	},
	externals: {
		'react': 'react/addons',
	},
	module: {
		loaders: [{ 
			test: /\.jsx$/, 
			loader: 'jsx' 
		}]
	}
};