/**
 * Value and description of the applied park rating effect.
 */
export interface Effect
{
	/**
	 * Indicates whether this effect is currently active and should be shown to the player.
	 */
	active: boolean;

	/**
	 * The name of the effect.
	 */
	name: string;

	/**
	 * A stringified version of the current value.
	 */
	value: string;

	/**
	 * Indicates how much the park rating is affected, as either a negative or positive integer.
	 */
	impact: number;

	/**
	 * A description of the origin of the effect, or what is causing the impact.
	 */
	note: string;

	/**
	 * The maximum impact this effect can have.
	 */
	maximum: number | null;

	/**
	 * A cache storage which can be used to store values or hashes to check if this influence
	 * has to be refreshed and recalculated. Primarily used to save on UI redraws if nothing
	 * has changed.
	 */
	cache: unknown;

	/**
	 * The default order of this effect.
	 */
	order: number;
}
