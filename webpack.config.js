const path = require('path');

module.exports = {
    entry: './src/index.ts',
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
        ],
        alias: {
            [path.resolve(__dirname, "src/static/config.json")]:
                path.resolve(
                    __dirname, 
                    "src/static/config.prod.json"
                )
        }
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