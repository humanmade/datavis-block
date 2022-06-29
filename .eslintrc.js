/* eslint quote-props: [ 'error', 'always' ] */// This file only.
module.exports = {
	'extends': [ '@humanmade/eslint-config' ],
	'rules': {
		'arrow-parens': [ 'error', 'always' ],
		'space-before-function-paren': [ 'warn', {
			'anonymous': 'never',
			'named': 'never',
			'asyncArrow': 'always',
		} ],
		'import/order': 'warn',
		'jsdoc/check-tag-names': [ 'warn', {
			// Permit Jest directive for opting in to jsdom environment.
			'definedTags': [ 'jest-environment' ],
		} ],
		'jsdoc/require-jsdoc': 'warn',
		'jsdoc/no-undefined-types': 'off',
		'react/jsx-sort-props': 'off',
	},
};
