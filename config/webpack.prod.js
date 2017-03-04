const webpackMerge = require('webpack-merge');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonConfig = require('./webpack.base.js');

module.exports = function(env) {
	return webpackMerge(commonConfig(),{
		plugins: [
			new uglifyJsPlugin()
		]
	})
};
