
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.join(__dirname, '../src/main.ts')
    },

    stats: {
        modules: false
    },

    module: {
        rules: [{
            test: /\.(tsx?)$/,
            exclude: /node_modules/,
            use: [{
                loader: "ts-loader"
            }]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(__dirname, "../public/index.html")
        })
    ],

    resolve: {
        extensions: [
            '.ts', '.js', '.tsx', '.jsx'
        ]
    }
}