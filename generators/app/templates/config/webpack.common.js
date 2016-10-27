/**
 * Copyright (C) 2016 yanni4night.com
 * webpack.common.js
 *
 * changelog
 * 2016-10-25[12:00:29]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const path = require('path');
const CONFIG = require('./config.js');

module.exports = {
    entry: {
        main: './src/javascripts/main.js',
        about: './src/javascripts/about.js'
    },
    output: {
        publicPath: './',
        path: path.join(__dirname, '..', CONFIG.OUTPUT)
    },
    resolve: {
        extensions: ['', '.js']
    },
    eslint: {
        configFile: `${__dirname}/.eslintrc`
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize!autoprefixer-loader")
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize!autoprefixer-loader!less-loader")
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: `url-loader?limit=1024&name=[name].[hash].[ext]`
        }]
    },
    bail: true,
    profile: true,
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: [`rm -rf ${CONFIG.OUTPUT}`]
        }),
        new ExtractTextPlugin(`[name].[contenthash].css`),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: `[name].[hash].js`,
            chunks: ['main', 'about']
        }),
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: './src/tpls/index.html',
            chunks: ['vendor', 'main'],
            chunksSortMode: CONFIG.sortChunks
        }),
        new HtmlWebpackPlugin({
            title: 'about',
            filename: 'about.html',
            template: './src/tpls/about.html',
            chunks: ['vendor', 'about'],
            chunksSortMode: CONFIG.sortChunks
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
};