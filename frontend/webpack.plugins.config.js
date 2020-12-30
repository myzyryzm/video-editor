/** @format */

const { resolve } = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')
const CompressionPlugin = require('compression-webpack-plugin')
// test media info
const CopyPlugin = require('copy-webpack-plugin')

/**
 * Decentralized configuration for webpack plugins
 * @param {boolean} productionMode
 * @param {object} env - env variable object
 * @return {Array.<object>} an array of plugins to be used in `webpack.config.js`
 */
exports.default = function (productionMode, buildMode = 'notprod') {
    let pluginsArrays = []
    if (productionMode) {
        // Define PRODUCTION variables
        pluginsArrays.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
            })
        )
    } else {
        // Define DEVELOPMENT variables
        // Enable HMR
        pluginsArrays.push(new webpack.LoaderOptionsPlugin({ debug: true }))
        pluginsArrays.push(new webpack.HotModuleReplacementPlugin())
    }

    pluginsArrays.push(new Dotenv())
    pluginsArrays.push(new webpack.HashedModuleIdsPlugin())

    pluginsArrays.push(
        new BundleTracker({
            filename: '../build/webpack-stats.json',
        })
    )
    pluginsArrays.push(new webpack.ProvidePlugin({ ReactGA: 'react-ga' }))
    pluginsArrays.push(new CleanWebpackPlugin())
    pluginsArrays.push(
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            title: 'ryzm',
            // meta: {
            //     viewport:
            //         'width=device-width, initial-scale=1, shrink-to-fit=no'
            //     // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            // }
            // chunksSortMode: 'none',
            // hash: true,
            // cache: true
        })
    )
    pluginsArrays.push(
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        })
    )
    pluginsArrays.push(new CompressionPlugin())

    // wavesurfer.js is required to produce waveforms for audio
    pluginsArrays.push(
        new webpack.ProvidePlugin({
            WaveSurfer: 'wavesurfer.js',
        })
    )

    // test
    pluginsArrays.push(
        new CopyPlugin({
            patterns: [
                {
                    from: resolve(
                        'node_modules',
                        'mediainfo.js',
                        'dist',
                        'MediaInfoModule.wasm'
                    ),
                    to: '.',
                },
            ],
        })
    )
    return pluginsArrays
}
