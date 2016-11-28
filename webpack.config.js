module.exports = [
	{
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
	},
	{
		entry: {
			testPopup: './dev/testPopup.jsx',
			testPage: './dev/testPage.jsx'
		},
		module: {
			loaders: [ 
				{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
				{ test: /\.css$/, loader: 'style-loader!css-loader'}
			]
		},
		output: {
			path: __dirname + '/dev',
			filename: '[name].bundle.js',
			publicPath: 'http://localhost:8091/'
		},
		resolve: {
			extensions: ['', '.js', '.jsx']
		}
	}
];
