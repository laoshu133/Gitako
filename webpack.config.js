const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const srcPath = path.resolve(__dirname, 'src')
const packagesPath = path.resolve(__dirname, 'packages')

const plugins = [
  new CopyWebpackPlugin([
    {
      from: './src/manifest.json',
      to: 'manifest.json',
    },
    {
      from: './src/assets/icons/*',
      to: 'icons/[name].[ext]',
    },
    {
      from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
      to: 'browser-polyfill.js',
    },
    {
      from: './src/firefox-shim.js',
      to: 'firefox-shim.js',
    },
  ]),
  new ForkTsCheckerWebpackPlugin(),
  new Dotenv(),
]

const analyse = process.env.ANALYSE !== undefined
if (analyse) {
  plugins.push(new BundleAnalyzerPlugin())
  console.log(`BundleAnalyzerPlugin added`)
}

const IN_PRODUCTION_MODE = process.env.NODE_ENV === 'production'
if (IN_PRODUCTION_MODE) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  )
}

module.exports = {
  entry: {
    content: './src/content.tsx',
  },
  devtool: IN_PRODUCTION_MODE ? 'source-map' : 'eval-source-map',
  mode: IN_PRODUCTION_MODE ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [srcPath, packagesPath, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        include: [srcPath, packagesPath],
      },
      {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader'],
        include: [srcPath],
      },
      {
        test: /\.svg$/,
        resourceQuery: /inline/,
        loader: ['url-loader'],
      },
      {
        test: /\.json$/,
        loader: ['json-loader'],
        include: [srcPath],
      },
    ],
  },
  plugins,
}
