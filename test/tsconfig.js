/* eslint-disable @typescript-eslint/no-var-requires */
const generatePaths = require('tsconfig-paths-autogen');
const { onmyjs } = require('onmyjs');

const baseUrl = 'src';

module.exports = {
	compilerOptions: {
		target: 'es2020',
		lib: ['dom', 'dom.iterable', 'esnext'],
		allowJs: true,
		skipLibCheck: true,
		esModuleInterop: true,
		allowSyntheticDefaultImports: true,
		noImplicitReturns: true,
		strict: true,
		forceConsistentCasingInFileNames: true,
		module: 'es2020',
		moduleResolution: 'node',
		resolveJsonModule: true,
		isolatedModules: true,
		noEmit: false,
		jsx: 'react',
		newLine: 'lf',
		baseUrl,
		paths: generatePaths(baseUrl, {
			rootAlias: '@',
			maxDirectoryDepth: 2,
			excludeAliasForSubDirectories: ['components'],
			includeAliasForDirectories: {
				common: 'b/c/d',
			},
		}),
	},
	include: ['src'],
	exclude: ['lib', 'build', 'node_modules', 'scripts', 'webpack', 'jest', 'tests', 'templates'],
};

onmyjs(module.exports, undefined, true);
