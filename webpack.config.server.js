"use strict";

const path = require("path");
const url = require("url");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const baseWebpackConfig = require("./webpack.config");

const baseUrl = "/";
const webpackDevServerPort = "8543";

module.exports = Object.assign({}, baseWebpackConfig, {
    entry: [
        ...baseWebpackConfig.entry.app,
        "webpack/hot/dev-server",
        `${require.resolve("webpack-dev-server/client/")}?https://localhost:${webpackDevServerPort}`,
    ],
    output: Object.assign({}, baseWebpackConfig.output, {
        publicPath: `https://localhost:${webpackDevServerPort}${baseUrl}`,
    }),
    module: Object.assign({}, baseWebpackConfig.module, {
        loaders: baseWebpackConfig.module.loaders.map(loader => {
            // Remove ExtractTextPlugin
            if (loader.test.toString() === "/\\.css$/") {
                return {
                    test: /\.css$/,
                    loaders: [
                        "style",
                        "css?sourceMap",
                        "postcss",
                    ],
                };
            } else if (loader.test.toString() === "/\\.less$/") {
                return {
                    test: /\.less$/,
                    loaders: [
                        "style",
                        "css?sourceMap",
                        "postcss",
                        "less?sourceMap",
                    ],
                };
            } else {
                return loader;
            }
        }),
    }),
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        ...baseWebpackConfig.plugins.filter((plugin) => !(plugin instanceof ExtractTextPlugin)),
    ],
    devServer: {
        contentBase: path.join(__dirname, "build", "src"),
        historyApiFallback: {
            index: baseUrl,
        },
        https: true,
        hot: true,
        port: webpackDevServerPort,
        proxy: {
            "*": {
                target: "https://localhost:8443",
                secure: false,
            },
        },
        publicPath: `https://localhost:${webpackDevServerPort}${baseUrl}`,
        stats: baseWebpackConfig.stats,
    },
});
