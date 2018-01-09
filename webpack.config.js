var path = require('path');
var webpack = require('webpack');

var plugins = [
	new webpack.PrefetchPlugin("react"),
	new webpack.PrefetchPlugin("react-dom"),
	new webpack.optimize.DedupePlugin(),
	new webpack.optimize.OccurenceOrderPlugin(),
];
var entry = './index.jsx';
var externals = {};

if (process.env.NODE_ENV === 'production') {
	plugins.push(new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}));
	entry = './src/index.js';
	externals = {
		'react': 'react',
		'react-dom': 'react-dom'
	};
}

module.exports = {
	entry: entry,
	output: {
		path: './dist',
		filename: 'homer-react-scroller.js',
		library: 'HomerReactScroller',
		libraryTarget: 'umd',
	},
	externals: externals,
	devServer: {
		contentBase: './',
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'es2015-loose', 'react'],
					plugins: ['system-import-transformer'],
				}
			}
		]
	},
	plugins: plugins
};