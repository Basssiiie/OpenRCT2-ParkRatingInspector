import { ParkInfo } from "./parkInfo";
import { Effect } from "./effects";
import { Influences } from "./influences";


/**
 * The effects on the park rating of a single park.
 */
export interface ParkRating
{
	/**
	 * The park for which to calculate the effects.
	 */
	readonly park: ParkInfo;

	/**
	 * Gets the effects applied to this park.
	 */
	readonly effects: Effect[];

	/**
	 * The total park rating as calculated by the plugin.
	 */
	total: number;

	/**
	 * Recalculates all effects for the park rating.
	 * @returns True if anything has changed, or false otherwise.
	 */
	recalculate(): boolean;
}


/**
 * Helper for calculating park rating effects.
 */
export const ParkRating =
{
	/**
	 * Calculates all effects currently applied to the park rating
	 * of the specified park.
	 */
	for(park: ParkInfo): ParkRating
	{
		const effects: Record<string, Effect> = {};
		const result: ParkRating =
		{
			park: park,
			total: 0,
			get effects()
			{
				return Object
					.keys(effects)
					.filter(k => effects[k].active)
					.map(k => effects[k]);
			},
			recalculate: () => recalculateEffects(effects, result)
		};
		return result;
	}
};


/**
 * Recalculates all effects on the specified park.
 * @returns True if any of the effects has changed, false if nothing has changed.
 */
function recalculateEffects(currentEffects: Record<string, Effect>, result: ParkRating): boolean
{
	result.park.refresh();

	let anyUpdate = false;
	let index = 0;
	let total = 0;
	for (const key in Influences)
	{
		index++;
		let effect = currentEffects[key];
		const isNew = (!effect);
		if (isNew)
		{
			effect = ({ order: index } as Effect);
			currentEffects[key] = effect;
		}

		const influence = Influences[key];
		if (influence && influence(effect, result.park))
		{
			anyUpdate = true;
		}
		if (effect.active && effect.impact)
		{
			total += effect.impact;
		}
	}
	result.total = total;
	return anyUpdate;
}