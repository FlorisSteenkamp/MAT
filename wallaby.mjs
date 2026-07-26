
export default function(wallaby) {
    return {
        autoDetect: ['jest'],

        files: [
            'package.json',
            'src/**/*.ts',
            '__tests__/helpers/*.ts'
        ],

        tests: [
            '__tests__/**/*.spec.ts'
        ],

        compilers: {
            "**/*.+(t)s?": wallaby.compilers.typeScript()
        },

        env: {
            type: 'node'
        },

        setup: function () {
            // globalThis.expect = chai.expect;
            // var should = chai.should();
        },

        workers: { restart: true },

        maxConsoleMessagesPerTest: 250
    };
};
