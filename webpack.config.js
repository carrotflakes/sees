module.exports = {
  entry: {
    build: './src/index.js',
  },
  output: {
    path: __dirname + "/dist",
    filename: "index.js",
    sourcePrefix: "",
    library: 'sees',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.uttr$/,
        use: "uttr-loader"
      }
    ]
  }
};
