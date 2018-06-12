var path = require('path');
var webpack = require('webpack');

var plugins = [
	new webpack.PrefetchPlugin("react"),
	new webpack.PrefetchPlugin("react-dom"),
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
		path: path.join(__dirname, './dist'),
		filename: 'homer-react-scroller.js',
		library: 'HomerReactScroller',
		libraryTarget: 'umd',
	},
	externals: externals,
	devServer: {
		contentBase: './',
	},
	plugins: plugins,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [ 'babel-loader' ],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
};