const path = require('path');
const webpackMerge = require('webpack-merge');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonConfig = require('./webpack.base.js');

module.exports = function(env) {
	return webpackMerge(commonConfig(), {
		entry: {
			pageLoader: path.resolve(__dirname, '../src/reader/pageLoader.jsx'),
			popupLoader: path.resolve(__dirname, '../src/popup/popupLoader.jsx')
		},
		output: {
			path: path.resolve(__dirname, '../extension'),
			filename: '[name].bundle.js'
		},
		plugins: [
			new uglifyJsPlugin()
		]
	})
};
