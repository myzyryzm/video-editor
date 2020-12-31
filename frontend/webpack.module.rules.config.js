/** @format */

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/**
 * Decentralized configuration for webpack module.rules
 * @param {boolean} productionMode
 * @return {Array.<object>} module rules
 */
exports.default = function (productionMode) {
    return [
        // {
        //     test: /\.(j)sx?$/,
        //     exclude: /node_modules/,
        //     loader: 'babel-loader'
        // },
        {
            test: /\.(ts|js)x?$/,
            use: { loader: 'awesome-typescript-loader' },
            exclude: /node_modules/,
        },
        {
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'source-map-loader',
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'file-loader',
            options: {
                name: '[sha512:hash:base64:7].[ext]',
            },
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: !productionMode,
                    },
                },
                'css-loader',
                // 'postcss-loader',
                'sass-loader',
            ],
        },
        {
            test: /\.mp3$/,
            loader: 'file-loader',
            options: {
                name: '[sha512:hash:base64:7].[ext]',
            },
        },
    ]
}
