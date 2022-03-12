// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	
	devServer: {
		static: '../dist',
		hot: true,
	},

	plugins: [
		new webpack.DefinePlugin({
			'GAME_SERVER': "'localhost:3000'",
		}),

		new webpack.HotModuleReplacementPlugin(),
	],
});
