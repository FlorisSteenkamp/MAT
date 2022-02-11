'use strict';

module.exports = {
    extension: ['ts', 'tsx'],
    spec: ['test/**/*.spec.ts'],
    recursive: true,
    loader: ['ts-node/esm'],
    // slow: '75',
    // timeout: '2000',
    // ignore: ['/path/to/some/ignored/file'],
    color: true,
    diff: true,
    exit: false,
    parallel: true,
    timeout: '2000',
    'v8-stack-trace-limit': 100 // V8 flags are prepended with "v8-"
};