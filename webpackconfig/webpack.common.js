
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.join(__dirname, '../src/main.ts')
    },

    module: {
        rules: [{
            test: /\.(tsx?)$/,
            exclude: /node_modules/,
            use: [{
                loader: "awesome-typescript-loader"
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