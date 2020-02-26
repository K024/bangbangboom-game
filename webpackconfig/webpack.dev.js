
var merge = require('webpack-merge');
var path = require("path")
var common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",

    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, '../build/')
    },

    devtool: 'source-map',

    devServer: {
        hot: true,
        contentBase: path.join(__dirname, "../public"),
        watchContentBase: true,
        index: "index.html",
        watchOptions: {
            watch: true,
            ignored: /(node_modules)/,
            poll: 1000
        },
        stats: {
            modules: false
        },
    },
})