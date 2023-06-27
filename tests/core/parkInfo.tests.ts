/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "openrct2-mocks";
import { ParkInfo } from "../../src/core/parkInfo";


test("Difficult rating is enabled", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park({ flags: [ "difficultParkRating" ] });
	globalThis.map = Mock.map();

	ParkInfo.refresh();

	t.true(ParkInfo.hasDifficultParkRating);
});


test("Difficult rating is disabled", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park();
	globalThis.map = Mock.map();

	ParkInfo.refresh();

	t.false(ParkInfo.hasDifficultParkRating);
});


test("Guest total is set", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park({ guests: 1234 });
	globalThis.map = Mock.map();

	ParkInfo.refresh();

	t.is(1234, ParkInfo.guests.total);
});


test("Happy guests are counted", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		tiles: Mock.tile(),
		entities: [
			Mock.guest({ happiness: 255 }), // super happy
			Mock.guest({ happiness: 129 }), // just happy
			Mock.guest({ happiness: 128 }), // not happy enough
			Mock.guest({ happiness: 1 }),   // super sad
		]
	});

	ParkInfo.refresh();

	t.is(4, ParkInfo.guests.total);
	t.is(2, ParkInfo.guests.happy);
});


test("Lost guests are counted", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		entities: [
			Mock.guest({ lostCountdown: 255, flags: [ "leavingPark" ] }), // not lost
			Mock.guest({ lostCountdown: 90,  flags: [ "leavingPark" ] }),  // almost lost
			Mock.guest({ lostCountdown: 89,  flags: [ "leavingPark" ] }),  // lost
			Mock.guest({ lostCountdown: 30,  flags: [ "leavingPark" ] }),  // lost
			Mock.guest({ lostCountdown: 30,  flags: [ "leavingPark" ], isInPark: false }),  // already left
			Mock.guest({ lostCountdown: 25 }), // lost but not leaving park
			Mock.guest({ lostCountdown: 15 }), // lost but not leaving park
		]
	});

	ParkInfo.refresh();

	t.is(6, ParkInfo.guests.total);
	t.is(2, ParkInfo.guests.lost);
});


test("Ride total is calculated", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		rides: [ Mock.ride(), Mock.ride(), Mock.ride(), Mock.ride(), Mock.ride() ]
	});

	ParkInfo.refresh();

	t.is(5, ParkInfo.rides.total);
});


test("Ride uptime is calculated", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		rides: [
			Mock.ride({ downtime: 0 }),   // 100
			Mock.ride({ downtime: 100 }), // 0
			Mock.ride({ downtime: 75 }),  // 25
			Mock.ride({ downtime: 15 }),  // 85
		]
	});

	ParkInfo.refresh();

	t.is(210, ParkInfo.rides.uptime);
});


test("Ride ratings are calculated", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		rides: [
			Mock.ride({ excitement: 310, intensity: 210 }), // 38, 26
			Mock.ride({ excitement: -1 }), // no ratings
			Mock.ride({ excitement: 820, intensity: 720 }), // 102, 90
			Mock.ride({ excitement: -1 }), // no ratings
		]
	});

	ParkInfo.refresh();

	t.is(140, ParkInfo.rides.excitement); // after divide by 8
	t.is(116, ParkInfo.rides.intensity); // after divide by 8
	t.is(2, ParkInfo.rides.withRatings);
	t.is(4, ParkInfo.rides.total);
});


test("Litter is counted when old", t =>
{
	globalThis.date = Mock.date({ ticksElapsed: 100_000 });
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		entities: [
			Mock<Litter>({ type: "litter", creationTick: 12_000 }), // super old litter
			Mock<Litter>({ type: "litter", creationTick: 52_000 }), // somewhat old litter
			Mock<Litter>({ type: "litter", creationTick: 92_000 }), // old litter
		]
	});

	ParkInfo.refresh();
	// Count only litter older than 7680 ticks (> 3 minutes and 12 seconds)
	t.is(3, ParkInfo.litter);
});


test("Litter is not counted when new", t =>
{
	globalThis.date = Mock.date({ ticksElapsed: 100_000 });
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		entities: [
			Mock<Litter>({ type: "litter", creationTick: 99_000 }), // very new litter
			Mock<Litter>({ type: "litter", creationTick: 93_000 }), // new litter
		]
	});

	ParkInfo.refresh();
	// Count only litter older than 7680 ticks (> 3 minutes and 12 seconds)
	t.is(0, ParkInfo.litter);
});


test("Litter does not count other entities", t =>
{
	globalThis.date = Mock.date({ ticksElapsed: 100_000 });
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		entities: [
			Mock.entity({ type: "balloon" }),
			Mock.entity({ type: "explosion_cloud" }),
		]
	});

	ParkInfo.refresh();
	t.is(0, ParkInfo.litter);
});


test("Litter with corrupt futuristic age is counted", t => // some sc6's have corrupted ages
{
	globalThis.date = Mock.date({ ticksElapsed: 100_000 });
	globalThis.park = Mock.park();
	globalThis.map = Mock.map({
		entities: [
			Mock<Litter>({ type: "litter", creationTick: 4_294_954_443 }),
			Mock<Litter>({ type: "litter", creationTick: 4_294_887_320 }),
			Mock<Litter>({ type: "litter", creationTick: 4_294_889_391 }),
		]
	});

	ParkInfo.refresh();
	t.is(3, ParkInfo.litter);
});


test("Casualty penalty is retrieved", t =>
{
	globalThis.date = Mock.date();
	globalThis.park = Mock.park({ casualtyPenalty: 246 });
	globalThis.map = Mock.map();

	ParkInfo.refresh();

	t.is(246, ParkInfo.casualtyPenalty);
});
