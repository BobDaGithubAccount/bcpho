const path = require('path');

module.exports = {
  entry: {
    client1: './src/client_1.ts',
    client2: './src/client_2.ts',
    client3: './src/client_3.ts',
    client4: './src/client_4.ts',
    client5: './src/client_5.ts',
    client6: './src/client_6.ts',
    client7: './src/client_7.ts',
    client8: './src/client_8.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
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