module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "tsconfigRootDir": __dirname,
        "sourceType": "module",
    },
    "plugins": [
      "@typescript-eslint/eslint-plugin",
      "jest",
    ],
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    "root": true,
    "env": {
        "node": true,
        "jest": true,
        "jest/globals": true,
    },
    "ignorePatterns": [".eslintrc.js"],
    "rules": {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "max-params": ["error"],
      "max-lines": ["error", { "max": 250, "skipComments": true }],
      "max-lines-per-function": [
        "error",
        {
          "max": 20,
          "skipBlankLines": true,
          "skipComments": true,
        }
      ],
      "complexity": ["error", 5]
    }
}
