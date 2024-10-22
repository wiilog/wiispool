const {ProvidePlugin} = require('webpack');
const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');

rules.push({
    test: /\.([cm]?ts|tsx)$/,
    loader: "ts-loader",
});
rules.push({
    test: /\.(css)$/,
    use: [
        {loader: 'style-loader'},
        {loader: 'css-loader'},
    ],
});
rules.push({
    test: /\.(scss)$/,
    use: [
        {loader: 'style-loader'},
        {loader: 'css-loader'},
        {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        require('autoprefixer')
                    ]
                }
            }
        },
        {loader: 'resolve-url-loader'},
        {loader: 'sass-loader'},
    ],
});

module.exports = {
    // Put your normal webpack config below here
    target: 'electron-renderer',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/icons', to: 'icons'},
                {from: 'src/images', to: 'images'},
                {from: 'src/templates', to: 'templates'},
            ]
        }),
    ],
    module: {
        rules,
    },
};
