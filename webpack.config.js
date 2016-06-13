module.exports = [
	{
		entry: {
			page: './src/page.jsx',
			popup: './src/popup.jsx'
		},
		module: {
			loaders: [ 
				{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'},
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
				{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'},
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
