module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
    ],
    env: {
        node: true,
        es2022: true,
        jest: true,
    },
    ignorePatterns: ["build/**", "node_modules/**"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "import/order": [
            "error",
            {
                "newlines-between": "always",
                alphabetize: { order: "asc", caseInsensitive: true },
            },
        ],
    },
};
