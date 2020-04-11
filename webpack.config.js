const path = require('path');
//const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    /*plugins: [
        new CopyWebpackPlugin(
            [
                {
                    from: 'static'
                }
            ]
        )
    ],*/
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: [
            '.tsx',
            '.ts',
            '.jsx',
            '.js',
            '.json'
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist/'),
        libraryTarget: 'commonjs',
    },
    target: "node",
    externals: [
        /^(?!\.|\/).+/i,
    ],
};