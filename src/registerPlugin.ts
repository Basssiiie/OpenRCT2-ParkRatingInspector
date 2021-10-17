/// <reference path="../lib/openrct2.d.ts" />

import { main } from "./main";
import { pluginVersion } from "./utilities/environment";

registerPlugin({
	name: "ParkRatingInspector",
	version: pluginVersion,
	targetApiVersion: 38,
	authors: ["Basssiiie"],
	type: "local",
	licence: "MIT",
	main,
});
