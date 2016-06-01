module.exports = {
	entry: {
		page: './src/page.js',
		popup: './src/popup.jsx',
		testPopup: './dev/testPopup.jsx'
	},
	module: {
		loaders: [ 
			{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'},
			{ test: /\.css$/, loader: 'style-loader!css-loader'}
		]
	},
	output: {
		path: __dirname + '/src',
		filename: '[name].bundle.js',
		publicPath: 'http://localhost:8090/assets'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
