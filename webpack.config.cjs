const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");


////////////////////////////////
const library = 'FloMat';
////////////////////////////////


const extensions = [
    '.js', '.mjs', '.cjs', 
    '.jsx', '.cjsx', '.mjsx'
];


const config_Basic = {
    // mode: 'production',
    mode: 'development',
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
    ]
}


const lib = {
    path: path.resolve(__dirname, 'browser'),
    library,
    libraryTarget: 'var'
};


/** Global var library, minified */ 
const config_VarMinify = {
    ...config_Basic,
    output: {
        filename: 'index.min.js',
        ...lib
    },
    optimization: {
        minimize: true
    }
};


/** Global var library, not minified */ 
const config_VarNoMinify = {
    ...config_Basic,
    output: {
        filename: 'index.js',
        ...lib
    },
    optimization: {
        minimize: false
    }
}


/** ESM, minified */ 
const config_EsmMinify = {
    ...config_Basic,
    output: {
        filename: 'index.module.min.js',
        path: path.resolve(__dirname, 'browser'),
        library: {
            type: 'module'
        }
    },
    optimization: {
        minimize: true
    },
    experiments: {
        outputModule: true
    }
};


/** ESM, not minified */ 
const config_EsmNoMinify = {
    ...config_Basic,
    output: {
        filename: 'index.module.js',
        path: path.resolve(__dirname, 'browser'),
        library: {
            type: 'module'
        }
    },
    optimization: {
        minimize: false
    },
    experiments: {
        outputModule: true
    }
};


module.exports = [
    // TODO - put back
    //config_VarMinify,
    //config_VarNoMinify,
    //config_EsmMinify,
    config_EsmNoMinify
];
