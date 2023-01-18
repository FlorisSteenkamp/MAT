module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "ignorePatterns": [
        "*.cjs",
        "*.min.js",
        "node_modules/",
        "dist/**/*",
        "build/**/*",
        "node/**/*",
        "browser/**/*",
        "unused/**/*",
        "src-unused/**/*",
        "test/**/*",
        "docs/**/*",
        "github assets/**/*",
        "papers/**/*"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "tree-shaking"
    ],
    "rules": {
        'no-constant-condition': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'no-sparse-arrays': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-loss-of-precision': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        "tree-shaking/no-side-effects-in-initialization": [
            2,
            {
                "noSideEffectsWhenCalled": [
                    { "function": "Object.freeze" },
                    {
                        "module": "#local",
                        "functions": [
                            "drawMat",
                            "getTotalBy"
                        ]
                    },
                    {
                        "module": "flo-memoize",
                        "functions": ["memoize"],
                    }
                ]
            }
        ]
    }
}
