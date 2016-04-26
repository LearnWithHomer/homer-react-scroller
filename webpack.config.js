var path = require('path');
var webpack = require('webpack');

var plugins = [
	new webpack.PrefetchPlugin("react"),
	new webpack.PrefetchPlugin("react-dom"),
	new webpack.optimize.DedupePlugin(),
	new webpack.optimize.OccurenceOrderPlugin(),
];
var entry = './index.jsx';

if (process.env.NODE_ENV === 'production') {
	plugins.push(new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}));
	plugins.push(new webpack.optimize.UglifyJsPlugin());
	entry = './src/index.js';
}

module.exports = {
	entry: entry,
	output: {
		path: './dist',
		filename: 'homer-react-scroller.js',
		library: 'HomerReactScroller',
		libraryTarget: 'umd',
	},
	externals: {
		'react': 'react',
		'react-dom': 'react-dom'
	},
	devServer: {
		contentBase: './',
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'jsx-loader',
				exclude: /node_modules/,
			}
		]
	},
	plugins: plugins
};