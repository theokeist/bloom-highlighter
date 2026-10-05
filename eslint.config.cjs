const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    { ignores: ['out/**', 'dist/**', 'node_modules/**', 'samples/**'] },
    ...tseslint.configs.recommended,
    {
        files: ['**/*.js', '**/*.cjs'],
        languageOptions: { sourceType: 'commonjs', globals: { console: 'readonly', process: 'readonly',
            Buffer: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly' } },
        rules: { '@typescript-eslint/no-require-imports': 'off' }
    },
    { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } }
);
