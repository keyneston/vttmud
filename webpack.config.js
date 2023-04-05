const path = require('path');

module.exports = {
  entry: path.join(__dirname, "client", "index.tsx"),
  output: {
    path:path.resolve(__dirname, "client", "dist"),
  },
  module: {
  rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            "loader": "babel-loader",
          },
          {
            "loader": 'ts-loader',
          }
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
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  }
}
