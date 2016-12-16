var path = require('path');

module.exports = {
	entry: './tape_player.js',
	output: {
		path: './bin',
		filename: 'json-tape.js'
	},
	module: {
		loaders: [
		{ 
			test: /\.json$/, 
			loader: "json-loader" 
		}, 
		{
			include: [
				'.'
			],
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				presets: [
					require.resolve("babel-preset-es2015")
				]
			}
		}]
	}
};
