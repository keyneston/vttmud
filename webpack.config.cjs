const CopyPlugin = require("copy-webpack-plugin");
const { PrismaPlugin } = require('experimental-prisma-webpack-plugin')
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
	mode: "development",
	entry: {
		serve: "./src/serve.ts",
	},
	externals: [nodeExternals()],
	target: "node",
	output: {
		filename: "[name].ts",
		path: path.resolve(__dirname, "build"),
	},
	module: {
		rules: [
			{
				test: /\.[tj]sx?$/,
				use: [
					{
						loader: "babel-loader",
					},
					{
						loader: "ts-loader",
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"],
	},
	node: {
		__dirname: true,
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "public" }, //to the dist root directory
			],
		}),
		new PrismaPlugin,
	],
};
