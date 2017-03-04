var path = require('path');

module.exports = function() {
	return {
		entry: {
			pageLoader: path.resolve(__dirname, '../src/pageLoader.jsx'),
			popupLoader: path.resolve(__dirname, '../src/popupLoader.jsx'),
			testPage: path.resolve(__dirname, '../dev/testPage.jsx'),
			testPopup: path.resolve(__dirname, '../dev/testPopup.jsx')
		},
		module: {
			rules: [
				{ 
					test: /\.jsx?$/, 
					exclude: path.resolve(__dirname, '../node_modules'), 
					loader: 'babel-loader'
				},
				{ 
					test: /\.css$/, 
					loader: 'style-loader!css-loader'
				}
			]
		},
		output: {
			path: path.resolve(__dirname, '../web'),
			filename: '[name].bundle.js'
		},
		resolve: {
			extensions: ['.js', '.jsx']
		}
	}
};
