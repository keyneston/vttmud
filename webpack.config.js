const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    serve: path.join(__dirname, "server", "serve.js"),
    "public/main": path.join(__dirname, "client", "index.tsx"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "public" }, //to the dist root directory
      ],
    }),
  ],
};
