// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const { merge } = require('webpack-merge');
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
