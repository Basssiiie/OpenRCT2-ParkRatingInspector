import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { getConfigHome, getDocumentsFolder } from "platform-folders";


// Environment variables
const build = process.env.BUILD || "development";
const isDev = (build === "development");

/**
 * Tip: if you change the path here to your personal user folder,
 * you can ignore this change in git with:
 * ```
 * > git update-index --skip-worktree rollup.config.js
 * ```
 * To accept changes on this file again, use:
 * ```
 * > git update-index --no-skip-worktree rollup.config.js
 * ```
 */
function getOutput()
{
	if (!isDev)
		return "./dist/ParkRatingInspector.js";

	const pluginPath = "OpenRCT2/plugin/ParkRatingInspector.js";
	if (process.platform === "win32")
	{
		return `${getDocumentsFolder()}/${pluginPath}`;
	}
	else // for both Mac and Linux
	{
		return `${getConfigHome()}/${pluginPath}`;
	}
}


/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
	input: "./src/plugin.ts",
	output: {
		file: getOutput(),
		format: "iife",
		compact: true
	},
	treeshake: "smallest",
	plugins: [
		resolve(),
		replace({
			preventAssignment: true,
			values: {
				__BUILD_CONFIGURATION__: JSON.stringify(build),
				...(isDev ? {} : {
					"Log.debug": "//",
					"Log.assert": "//"
				})
			}
		}),
		typescript(),
		terser({
			compress: {
				passes: 5,
				toplevel: true,
				unsafe: true
			},
			format: {
				comments: false,
				quote_style: 1,
				wrap_iife: true,
				preamble: "// Get the latest version: https://github.com/Basssiiie/OpenRCT2-ParkRatingInspector",

				beautify: isDev,
			},
			mangle: isDev ? {}
			: {
				properties: {
					regex: /^_/
				}
			},

			// Useful only for stacktraces:
			keep_fnames: isDev,
		}),
	],
};
export default config;