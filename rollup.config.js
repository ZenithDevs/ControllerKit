import TypeScript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/controllerkit.js',
			format: 'es'
		},
		{
			file: 'docs/demo/controllerkit.js',
			name: 'ControllerKit',
			format: 'iife'
		}
	],
	plugins: [
		TypeScript()
	]
};