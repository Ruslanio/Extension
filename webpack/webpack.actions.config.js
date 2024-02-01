const webpack = require('webpack');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.DefinePlugin({
            API_KEY: JSON.stringify(process.env.API_KEY)
        })
    ],
});