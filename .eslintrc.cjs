module.exports = {
	root: true,
	env: {node: true, browser: true, es2021: true},
	parser: '@typescript-eslint/parser',
	parserOptions: {ecmaVersion: 2021, sourceType: 'module', extraFileExtensions: ['.vue']},
	plugins: ['vue', '@typescript-eslint', 'import'],
	extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
	settings: {'import/resolver': {typescript: {}}},
	rules: {},
	overrides: [
		{
			files: ['*.vue'],
			parser: 'vue-eslint-parser',
			parserOptions: {parser: '@typescript-eslint/parser'}
		}
	]
}