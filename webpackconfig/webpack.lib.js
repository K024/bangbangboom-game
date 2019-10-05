
var path = require('path');

module.exports = {
    mode: "development",
    // mode: "production",

    entry: {
        main: path.join(__dirname, '../src/index.ts')
    },

    output: {
        filename: 'bangbangboom-game.js',
        path: path.join(__dirname, '../lib/'),
        library: "BangGame",
        libraryTarget: "umd",
        umdNamedDefine: true
    },

    devtool: "source-map",

    module: {
        rules: [{
            test: /\.(tsx?)$/,
            exclude: /node_modules/,
            use: [{
                loader: "awesome-typescript-loader"
            }]
        }]
    },

    plugins: [],

    resolve: {
        extensions: [
            '.ts', '.js', '.tsx', '.jsx'
        ]
    },
    externals: {
        'pixi.js': {
            root: "PIXI",
            commonjs: 'pixi.js',
            commonjs2: 'pixi.js',
            amd: 'pixi.js',
        }
    }
}