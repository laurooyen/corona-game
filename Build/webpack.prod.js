const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
	mode: 'production',

	output: {
		filename: '[name].[contenthash].js',
	},

	//devtool: 'source-map',

	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		runtimeChunk: 'single',
	},

	plugins: [
		new webpack.DefinePlugin({
			'GAME_SERVER': "'game.floatymonkey.com'",
		}),
	],
});
