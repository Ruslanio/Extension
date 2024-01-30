const properties = require('./properties.json')

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const webpack = require('webpack');

const backgroundFiles = glob.sync(path.join(__dirname, '../src/background/**/*.ts*'))
const contentFiles = glob.sync(path.join(__dirname, '../src/content/**/*.ts*'))

module.exports = {
    mode: "production",
    entry: {
        background: backgroundFiles,
        content: contentFiles
    },
    optimization: {
        minimize: true
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
        new webpack.DefinePlugin({
            API_KEY: JSON.stringify(properties['api-key'])
        })
    ],
};