const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob')
const webpack = require('webpack');

const backgroundFiles = glob.sync(path.join(__dirname, '../src/background/**/*.ts*'))
const contentFiles = glob.sync(path.join(__dirname, '../src/content/**/*.ts*'))

console.log("content files: ", contentFiles)
console.log("background files: ", backgroundFiles)

module.exports = {
    mode: "production",
    entry: {
        background: backgroundFiles,
        content: contentFiles
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
        })
    ],
};