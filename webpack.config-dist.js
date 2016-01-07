'use strict';

var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	plugins: [
		new webpack.PrefetchPlugin("react/addons"),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
	],
	output: {
		filename: 'dist/index.js',
		libraryTarget: 'umd',
		library: 'HomerReactScroller'
	},
	externals: [
		'react', 'react/addons'
	],
	module: {
		loaders: [{ 
			test: /\.jsx$/, 
			loader: 'jsx' 
		}]
	}
};