import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
	input: "./src/registerPlugin.ts",
	output: {
		file: "./dist/ParkRatingInspector.js", // CHANGE THIS TO YOUR OPENRCT2 PLUGIN FOLDER FOR HOT RELOAD
		// TO IGNORE GIT CHANGES ON THIS FILE: git update-index --skip-worktree rollup.config.dev.js
		// TO ACCEPT GIT CHANGES ON THIS FILE AGAIN: git update-index --no-skip-worktree rollup.config.dev.js
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
				__BUILD_CONFIGURATION__: JSON.stringify("development")
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

				beautify: true
			},

			// Useful only for stacktraces:
			keep_fnames: true,
		}),
	],
};
