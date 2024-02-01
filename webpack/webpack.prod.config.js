const properties = require('./properties.json')

const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');
const webpack = require('webpack');

module.exports = merge(common, {
    optimization: {
        minimize: true
    },
    plugins: [
        new webpack.DefinePlugin({
            API_KEY: JSON.stringify(properties['api-key'])
        })
    ],
});