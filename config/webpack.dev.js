const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.base.js');

module.exports = function(env) {
	return webpackMerge(commonConfig());
};
