const path = require("path");
/**
 * Webpack configuration
 * Run using "webpack" or "npm run build"
 */
module.exports = {
  // Entry points locations.
  entry: "./src/js/index.js",

  // (Output) bundle locations.
  output: {
    path: path.resolve("public/"),
    filename: "[name].js", // file
    chunkFilename: "[name].bundle.js",
    publicPath: "/public/",
  },

  // Modules
  module: {
    rules: [
      // .js
      {
        test: /.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },

  // mode: isProduction ? 'production' : 'development',
  mode: "production",
};
