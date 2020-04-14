const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ['./Source/index.js'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../dist'),
	},
	resolve: {
		alias: {
		  "@": path.resolve(__dirname, '../Source/'),
		},
		extensions: ['.js', '.json', '.vue', '.css'],
	},
	module: {
		rules: [
			{ test: /\.vue$/, use: 'vue-loader' },
			{ test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
			{ test: /\.scss$/, use: ['vue-style-loader', 'css-loader', 'sass-loader'] },

			{
				test: /\.(jpg|png|svg)$/,
				loader: 'file-loader',
				options: {
					name: 'Assets/Images/[name].[ext]'
				},
			},

			{
				test: /\.(mp3|ogg|wav)$/,
				loader: 'file-loader',
				options: {
					name: 'Assets/Audio/[name].[ext]'
				}
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: './Source/index.html',
			inject: 'body',
		})
	]
};
