import TypeScript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/controllerkit.js',
		format: 'es'
	},
	plugins: [
		TypeScript()
	]
};