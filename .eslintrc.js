module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: ['plugin:vue/vue3-recommended', 'prettier', 'plugin:prettier/recommended'],
    rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        // 允许声明未使用变量
        'no-unused-vars': 'off',
        'vue/component-tags-order': [
            'error',
            {
                order: ['template', 'script', 'style']
            }
        ]
    }
};
