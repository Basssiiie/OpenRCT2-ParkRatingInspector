/**
 * Base api that keeps track on important info in the park.
 */
export interface ParkInfo
{
	/**
	 * Whether the park has the scenario option for difficult park rating enabled.
	 */
	hasDifficultParkRating: boolean;

	/**
	 * Information about guests in the park.
	 */
	guests: {
		/**
		 * Total amount of guests.
		 */
		total: number;

		/**
		 * Total amount of happy guests.
		 */
		happy: number;

		/**
		 * Total amount of lost guests.
		 */
		lost: number;
	};

	/**
	 * Information about all rides in the park.
	 */
	rides: {
		/**
		 * Total amount of rides.
		 */
		total: number;

		/**
		 * Total amount of uptime of all rides.
		 */
		uptime: number;

		/**
		 * Total amount of ratings that have ratings.
		 */
		withRatings: number;

		/**
		 * Total amount of excitement of all rides.
		 */
		excitement: number;

		/**
		 * Total amount of intensity of all rides.
		 */
		intensity: number;
	};

	/**
	 * Total amount of litter in the park.
	 */
	litter: number;

	/**
	 * Total penalty gained from guest deaths or ride crashes.
	 */
	casualtyPenalty: number;

	/**
	 * Refreshes all information about the park.
	 */
	refresh(): void;
}


export const ParkInfo: ParkInfo =
{
	hasDifficultParkRating: false,
	guests: {
		total: 0,
		happy: 0,
		lost: 0,
	},
	rides: {
		total: 0,
		uptime: 0,
		withRatings: 0,
		excitement: 0,
		intensity: 0,
	},
	litter: 0,
	casualtyPenalty: 0,

	refresh()
	{
		// Park info
		this.hasDifficultParkRating = park.getFlag("difficultParkRating");

		// Guest information
		this.guests.total = park.guests;

		const guests = map.getAllEntities("guest");
		let happy = 0, lost = 0;

		for (const guest of guests)
		{
			if (!guest.isInPark)
				continue;

			if (guest.happiness > 128)
				happy++;
			if (guest.getFlag("leavingPark") && guest.isLost)
				lost++;
		}

		this.guests.happy = happy;
		this.guests.lost = lost;

		// Ride information
		let rideCount = 0, ridesUptime = 0, excitement = 0, intensity = 0, withRatings = 0;

		const rides = map.rides;
		for (const ride of rides)
		{
			ridesUptime += (100 - ride.downtime);
			rideCount++;

			if (ride.excitement > 0 || ride.intensity > 0)
			{
				excitement += Math.floor(ride.excitement / 8);
				intensity += Math.floor(ride.intensity / 8);
				withRatings++;
			}
		}

		this.rides.total = rideCount;
		this.rides.uptime = ridesUptime;
		this.rides.withRatings = withRatings;
		this.rides.excitement = excitement;
		this.rides.intensity = intensity;

		// Litter
		const litter = map.getAllEntities("litter");
		const currentTick = date.ticksElapsed;

		let litterCount = 0;
		for (const item of litter)
		{
			if ((currentTick - item.creationTick) >= 7680)
			{
				litterCount++;
			}
		}
		this.litter = litterCount;

		// Casualties
		this.casualtyPenalty = park.casualtyPenalty;
	}
};