
const path = require('path');

const projectRoot = '../';

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.d.ts' ],
        // The aliases below should not be used in production - rather, the correct node modules should be referenced.
        alias: {
            'flo-graham-scan$':         path.resolve(__dirname, projectRoot + 'grahamscan/index.ts'),
            'flo-bezier3$':             path.resolve(__dirname, projectRoot + 'bezier/index.ts'),
            'flo-gauss-quadrature$':    path.resolve(__dirname, projectRoot + 'gaussquadrature/index.ts'),
            'flo-lines-intersections$': path.resolve(__dirname, projectRoot + 'linesintersections/index.ts'),
            'flo-ll-rb-tree$':          path.resolve(__dirname, projectRoot + 'llrbtree/index.ts'),
            'flo-memoize$':             path.resolve(__dirname, projectRoot + 'memoize/index.ts'),
            'flo-morph$':               path.resolve(__dirname, projectRoot + 'morph/index.ts'),
            'flo-poly$':                path.resolve(__dirname, projectRoot + 'poly/index.ts'),
            'flo-vector2d$':            path.resolve(__dirname, projectRoot + 'vector/index.ts'),
        }
    },
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'browser'),
        library: 'FloMat',
        libraryTarget: 'var'
    }
};