import TypeScript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/controllerkit.js',
		format: 'cjs'
	},
	plugins: [
		TypeScript()
	]
};