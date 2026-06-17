import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            }
        },
        ignores: [
            'dist/',
            'node_modules/',
            '*.config.js',
            '*.config.ts'
        ]
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    }
);