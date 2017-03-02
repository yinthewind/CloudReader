module.exports = {
	entry: {
		pageLoader: './src/pageLoader.jsx',
		popupLoader: './src/popupLoader.jsx',
		testPage: './dev/testPage.jsx',
		testPopup: './dev/testPopup.jsx'
	},
	module: {
		rules: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
			{ test: /\.css$/, loader: 'style-loader!css-loader'}
		]
	},
	output: {
		path: __dirname + '/web',
		filename: '[name].bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
};
