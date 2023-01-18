const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");


const extensions = [
    '.js', '.mjs', '.cjs', 
    '.jsx', '.cjsx', '.mjsx'
];


const config_Basic = {
    mode: 'production',
    // mode: 'development',
    entry: './src/index.ts',
    resolve: {
        extensions,
        plugins: [
            new ResolveTypeScriptPlugin({includeNodeModules: false})
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    stats: {
        // Don't display most things
        all: false,
        colors: true,
        errors: true,
        builtAt: true
    },
    plugins: [
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        })
    ],
    output: {
        path: path.resolve(__dirname, 'browser'),
        library: { type: 'module' }
    },
    experiments: { outputModule: true }
}


/** ESM, minified */ 
const config_EsmMinify = {
    ...config_Basic,
    output: {
        ...config_Basic.output,
        filename: 'index.min.js',
    },
    optimization: { minimize: true }
};


/** ESM, not minified */ 
const config_EsmNoMinify = {
    ...config_Basic,
    output: {
        ...config_Basic.output,
        filename: 'index.js',
    },
    optimization: { minimize: false },
};


module.exports = [
    config_EsmMinify,
    config_EsmNoMinify
];
