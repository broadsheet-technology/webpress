const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
	...defaultConfig,
	entry: "./src/wordpress-script/index.tsx",
	module: {
		...defaultConfig.module,
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader"
			},
			...defaultConfig.module.rules,
		],
	},

	resolve: {
		...defaultConfig.resolve,
		extensions: [".tsx", ".ts", "js", "jsx"],
	},

	output: {
		...defaultConfig.output,
		filename: "index.js",
		path:  path.resolve(__dirname, "dist-script"),
	},
};
