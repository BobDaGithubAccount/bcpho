const path = require('path');

module.exports = {
  mode: 'development', // Set the mode to 'development' or 'production'
  entry: {
    client_1: './src/client_1.ts',
    client_2: './src/client_2.ts',
    client_3: './src/client_3.ts',
    client_4: './src/client_4.ts',
    client_5: './src/client_5.ts',
    client_6: './src/client_6.ts',
    client_7: './src/client_7.ts',
    client_8: './src/client_8.ts',
    client_8: './src/client_cfd.ts',
    client_lagrangian: './src/client_lagrangian.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};