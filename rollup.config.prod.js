import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
	input: "./src/registerPlugin.ts",
	output: {
		file: "./dist/ParkRatingInspector.js",
		format: "iife",
	},
	plugins: [
		// Resolve and compile external libraries...
		nodeResolve(),
		commonjs(),
		// Update environment variables...
		replace({
			include: "./src/utilities/environment.ts",
			preventAssignment: true,
			values: {
				__BUILD_CONFIGURATION__: JSON.stringify("production")
			}
		}),
		// Compile plugin...
		typescript(),
		terser({
			compress: {
				passes: 3
			},
			format: {
				quote_style: 1,
				wrap_iife: true,
				preamble: "// Get the latest version: https://github.com/Basssiiie/OpenRCT2-ParkRatingInspector",
			},
			mangle: {
				properties: {
					regex: /^_/
				}
			},
		}),
	],
};
