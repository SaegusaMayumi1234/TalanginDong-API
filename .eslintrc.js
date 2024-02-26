export default {
    "env": {
        "browser": true,
        "es2021": true
    },
    "plugins": ["@typescript-eslint"],
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        // to enforce using type for object type definitions, can be type or interface 
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    }
}
