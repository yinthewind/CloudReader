module.exports = {
	entry: {
		page: "./src/page.js",
		popup: "./src/popup.jsx"
	},
	module: {
		loaders: [ { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'} ]
	},
	output: {
		path: __dirname + "/src",
		filename: "[name].bundle.js"
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
