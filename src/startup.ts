import { WindowTemplate, label, listview, store, window } from "openrct2-flexui";
import { ParkInfo } from "./core/parkInfo";
import { ParkRating } from "./core/parkRating";
import { isUiAvailable, pluginVersion, requiredApiVersion } from "./utilities/environment";
import * as Log from "./utilities/logger";


const viewmodel =
{
	parkRating: ParkRating.for(ParkInfo),
	nextUpdate: 0,

	currentRatingLabel: store(""),
	items: store<ListViewItem[]>([]),

	check(): void
	{
		// Check only four times per second...
		const tickCount = date.ticksElapsed;
		if (tickCount < this.nextUpdate)
			return;

		this.nextUpdate = (tickCount + 10);

		// Only update if something has changed...
		if (this.parkRating.recalculate())
		{
			this.redraw();
		}
	},

	redraw(): void
	{
		const rating = this.parkRating.total;
		this.currentRatingLabel.set(`Current park rating: ${rating}/999`);

		const effects = this.parkRating.effects.sort((l, r) => (r.impact - l.impact) || (l.order - r.order));
		const count = effects.length;
		const oldItems = this.items.get();
		const newItems = Array<ListViewItem>(count);

		for (let i = 0; i < count; i++)
		{
			const effect = effects[i];
			const color =
				(effect.impact === effect.maximum) ? "{GREEN}+" :
				(effect.impact > 0) ? "{CELADON}+" :
				(effect.impact < 0) ? "{RED}" : "   ";

			const row = (oldItems[i] as string[]) || Array<string>(4);
			row[0] = effect.name;
			row[1] = effect.value;
			row[2] = (color + effect.impact.toString());
			row[3] = effect.note;
			newItems[i] = row;
		}
		this.items.set(newItems);
	}
};


let template: WindowTemplate | undefined;
function getWindow(): WindowTemplate
{
	if (template)
		return template;

	return (template = window({
		title: `Park Rating Inspector (v${pluginVersion})`,
		width: { value: 550, min: 350, max: 1200 },
		height: { value: 210, min: 150, max: 300 },
		spacing: 3,
		content: [
			listview({
				columns: [
					{ header: "Name", width: "35%" },
					{ header: "Value", width: "110px" },
					{ header: "Impact", width: "45px" },
					{ header: "Notes", width: "65%" }
				],
				items: viewmodel.items,
				isStriped: true,
			}),
			label({
				text: viewmodel.currentRatingLabel,
				alignment: "centred",
				height: 12
			}),
			label({
				text: "github.com/Basssiiie/OpenRCT2-ParkRatingInspector",
				alignment: "centred",
				disabled: true
			}),
		],
		onUpdate: () => viewmodel.check()
	}));
}


/**
 * Entry point of the plugin.
 */
export function startup(): void
{
	Log.debug("Plugin started.");

	if (!isUiAvailable)
	{
		return;
	}

	ui.registerMenuItem("Inspect park rating", () =>
	{
		if (!context.apiVersion || context.apiVersion < requiredApiVersion)
		{
			const title = "Please update the game!";
			const message = "\nThe version of OpenRCT2 you are currently playing is too old for this plugin.";

			ui.showError(title, message);
			console.log(`[ParkRatingInspector] ${title} ${message}`);
			return;
		}

		viewmodel.nextUpdate = 0;
		getWindow().open();
	});
};
