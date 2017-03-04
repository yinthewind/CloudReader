const path = require('path');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.base.js');

module.exports = function(env) {
	return webpackMerge(commonConfig(), {
		entry: {
			testPage: path.resolve(__dirname, '../dev/testPage.jsx'),
			testPopup: path.resolve(__dirname, '../dev/testPopup.jsx')
		},
		output: {
			path: path.resolve(__dirname, '../dev'),
			filename: '[name].bundle.js'
		}
	})
};
