
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.d.ts' ]
    },
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'browser'),
        library: 'FloMat',
        libraryTarget: 'var'
    }
};