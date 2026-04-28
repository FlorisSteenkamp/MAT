// const CircularDependencyPlugin = require('circular-dependency-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');


const config_Basic = (env, argv) => {
    const mode = argv.mode === 'production'
        ? 'production'
        : 'development';

    const devtool = mode === 'production'
        ? false
        : 'eval-cheap-module-source-map';

    return {
        mode,
        devtool,
        output: {
            path: path.resolve(__dirname, 'browser'),
            library: { type: 'module' }
        },
        entry: './src/index.ts',
        resolve: {
            extensions: [
                '.js', '.mjs', '.cjs', 
                '.jsx', '.cjsx', '.mjsx',
                '.tsx', '.ts', '.d.ts'
            ],
            extensionAlias: {
                ".js": [".js", ".ts"],
                ".cjs": [".cjs", ".cts"],
                ".mjs": [".mjs", ".mts"]
            },
            alias: {}
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: { silent: true }
                }],
                exclude: /node_modules/,
                sideEffects: false
            }]
        },
        stats: {
            // Don't display most things
            all: false,
            colors: true,
            errors: true,
            builtAt: true
        },
        plugins: [
            // new CircularDependencyPlugin({
            //     // exclude detection of files based on a RegExp
            //     exclude: /node_modules/,
            //     // add errors to webpack instead of warnings
            //     failOnError: true,
            //     // set the current working directory for displaying module paths
            //     cwd: process.cwd(),
            // })
        ],
        experiments: { outputModule: true }
    };
}


/** ESM, minified */ 
const config_EsmMinify = (env, argv) => {
    const baseConfig = config_Basic(env, argv);

    return {
        ...baseConfig,
        output: {
            ...baseConfig.output,
            filename: 'index.min.js',
        },
        optimization: { minimize: true }
    };
};


/** ESM, not minified */ 
const config_EsmNoMinify = (env, argv) => {
    const baseConfig = config_Basic(env, argv);

    return {
        ...baseConfig,
        output: {
            ...baseConfig.output,
            filename: 'index.js',
        },
        optimization: { minimize: false },
    };
};


module.exports = [
    config_EsmMinify,
    config_EsmNoMinify
];
