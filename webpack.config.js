module.exports = {
	entry: {
		pageLoader: './src/pageLoader.jsx',
		popupLoader: './src/popupLoader.jsx'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
			{ test: /\.css$/, loader: 'style-loader!css-loader'}
		]
	},
	output: {
		path: __dirname + '/src',
		filename: '[name].bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
