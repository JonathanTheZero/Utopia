const path = require('path');

/**
 * As the mode: 'production' property indicates,
 * the main usage for webpack is for using it production,
 * otherwise use the default TypeScript compiler.
 * 
 * At least as long as you don't plan on modifying webpack here
 */
module.exports = {
    mode: 'production',
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
            [
                path.resolve(
                    __dirname,
                    'src/static/config.json'
                )
            ]:
                path.resolve(
                    __dirname,
                    'src/static/config.prod.json'
                )
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(
            __dirname,
            './dist/'
        ),
        libraryTarget: 'commonjs',
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [
        /^(?!\.|\/).+/i
    ],
    optimization: {
        minimize: true,
        namedModules: false,
        namedChunks: false,
        moduleIds: 'size',
        chunkIds: 'size',
        removeAvailableModules: true,
        mangleWasmImports: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        occurrenceOrder: true,
        providedExports: true,
        usedExports: true,
        concatenateModules: true
    }
};