module.exports = {
    root: true,
    ignores: ['**/node_modules/**'],
    extends: [
        'eslint:recommended',
        '@react-native',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['prettier', '@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto', // 줄바꿈 문자 자동 설정
            },
        ],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'no-unused-vars': 0,
        'no-console': 'warn',
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 0,
    },
};
