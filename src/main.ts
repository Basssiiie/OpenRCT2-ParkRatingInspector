import fui, { WindowTemplate } from "openrct2-fluentui";
import { ParkInfo } from "./core/parkInfo";
import { ParkRating } from "./core/parkRating";
import { isUiAvailable, pluginVersion } from "./utilities/environment";
import * as Log from "./utilities/logger";


const viewmodel =
{
	parkRating: ParkRating.for(ParkInfo),
	nextUpdate: 0,

	currentRatingLabel: fui.observable<string>(""),
	items: fui.observable<ListViewItem[]>([]),

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
		const target = this.items.get();
		target.length = effects.length;

		for (let i = 0; i < effects.length; i++)
		{
			const effect = effects[i];
			const color =
				(effect.impact === effect.maximum) ? "{GREEN}+" :
				(effect.impact > 0) ? "{CELADON}+" :
				(effect.impact < 0) ? "{RED}" : "   ";

			let row = (target[i] as string[]);
			if (!row)
				target[i] = row = Array<string>(4);

			row[0] = effect.name;
			row[1] = effect.value;
			row[2] = (color + effect.impact.toString());
			row[3] = effect.note;
		}
		this.items.set(target);
	}
};


let template: WindowTemplate | undefined;
function window(): WindowTemplate
{
	if (template)
		return template;

	return (template = fui.window({
		title: `Park Rating Inspector (v${pluginVersion})`,
		width: 550, height: 210,
		minWidth: 350, minHeight: 150,
		maxWidth: 1200, maxHeight: 300,
		padding: 5,
		content: b => b
		.listview({
			content: b => b
			.column({
				header: "Name",
				width: "35%"
			})
			.column({
				header: "Value",
				width: "110px"
			})
			.column({
				header: "Impact",
				width: "45px"
			})
			.column({
				header: "Notes",
				width: "65%"
			}),
			items: viewmodel.items,
			isStriped: true,
		})
		.label({
			text: viewmodel.currentRatingLabel,
			alignment: "centred",
			height: "20px",
			padding: [2, 10]
		})
		.label({
			text: "github.com/Basssiiie/OpenRCT2-ParkRatingInspector",
			alignment: "centred",
			disabled: true,
			height: "12px",
			padding: [0, 10]
		}),
		onUpdate: () => viewmodel.check()
	}));
}


/**
 * Entry point of the plugin.
 */
export function main(): void
{
	Log.debug("Plugin started.");

	if (!isUiAvailable)
	{
		return;
	}

	ui.registerMenuItem("Inspect park rating", () =>
	{
		if (!context.apiVersion || context.apiVersion < 36)
		{
			const title = "Please update the game!";
			const message = "\nThe version of OpenRCT2 you are currently playing is too old for this plugin.";

			ui.showError(title, message);
			console.log(`[ParkRatingInspector] ${title} ${message}`);
			return;
		}

		viewmodel.nextUpdate = 0;
		window().open();
	});
};
