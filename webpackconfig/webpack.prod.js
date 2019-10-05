
var merge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require("path");
var common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",

    output: {
        filename: 'js/[name].[hash:8].js',
        path: path.join(__dirname, '../docs/')
    },

    // devtool: 'source-map',

    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(__dirname, "../public"),
            to: path.join(__dirname, "../build"),
            ignore: path.join(__dirname, "../public/index.html")
        }])
    ],

    performance: {
        assetFilter: function (assetFilename) {
            return (/\.(js|css)$/.test(assetFilename))
        }
    }
})