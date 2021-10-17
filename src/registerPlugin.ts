/// <reference path="../lib/openrct2.d.ts" />

import { main } from "./main";
import { pluginVersion, requiredApiVersion } from "./utilities/environment";

registerPlugin({
	name: "ParkRatingInspector",
	version: pluginVersion,
	targetApiVersion: requiredApiVersion,
	authors: ["Basssiiie"],
	type: "local",
	licence: "MIT",
	main,
});
