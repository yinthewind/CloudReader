var path = require('path');

module.exports = function() {
	return {
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
		resolve: {
			extensions: ['.js', '.jsx']
		}
	}
};
