/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "openrct2-mocks";
import { ParkInfo } from "../../src/core/parkInfo";


test("Difficult rating is enabled", t =>
{
	global.date = Mock.date();
	global.park = Mock.park({ flags: [ "difficultParkRating" ] });
	global.map = Mock.map();

	ParkInfo.refresh();

	t.true(ParkInfo.hasDifficultParkRating);
});


test("Difficult rating is disabled", t =>
{
	global.date = Mock.date();
	global.park = Mock.park();
	global.map = Mock.map();

	ParkInfo.refresh();

	t.false(ParkInfo.hasDifficultParkRating);
});


test("Guest total is set", t =>
{
	global.date = Mock.date();
	global.park = Mock.park({ guests: 1234 });
	global.map = Mock.map();

	ParkInfo.refresh();

	t.is(1234, ParkInfo.guests.total);
});


test("Happy guests are counted", t =>
{
	global.date = Mock.date();
	global.park = Mock.park();
	global.map = Mock.map({
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
	global.date = Mock.date();
	global.park = Mock.park();
	global.map = Mock.map({
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
	global.date = Mock.date();
	global.park = Mock.park();
	global.map = Mock.map({
		rides: [ Mock.ride(), Mock.ride(), Mock.ride(), Mock.ride(), Mock.ride() ]
	});

	ParkInfo.refresh();

	t.is(5, ParkInfo.rides.total);
});


test("Ride uptime is calculated", t =>
{
	global.date = Mock.date();
	global.park = Mock.park();
	global.map = Mock.map({
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
	global.date = Mock.date();
	global.park = Mock.park();
	global.map = Mock.map({
		rides: [
			Mock.ride({ excitement: 310, intensity: 210 }), // 38, 26
			Mock.ride(), // no ratings
			Mock.ride({ excitement: 820, intensity: 720 }), // 102, 90
			Mock.ride(), // no ratings
		]
	});

	ParkInfo.refresh();

	t.is(140, ParkInfo.rides.excitement); // after divide by 8
	t.is(116, ParkInfo.rides.intensity); // after divide by 8
	t.is(2, ParkInfo.rides.withRatings);
	t.is(4, ParkInfo.rides.total);
});


test("Litter is counted", t =>
{
	global.date = Mock.date({ ticksElapsed: 100_000 });
	global.park = Mock.park();
	global.map = Mock.map({
		entities: [
			Mock<Litter>({ type: "litter", creationTime: 99_000 }), // very new litter
			Mock<Litter>({ type: "litter", creationTime: 93_000 }), // new litter
			Mock.entity({ type: "balloon" }),
			Mock<Litter>({ type: "litter", creationTime: 92_000 }), // old litter
		]
	});

	ParkInfo.refresh();

	t.is(3, ParkInfo.litter);
});


test("Casualty penalty is retrieved", t =>
{
	global.date = Mock.date();
	global.park = Mock.park({ casualtyPenalty: 246 });
	global.map = Mock.map();

	ParkInfo.refresh();

	t.is(246, ParkInfo.casualtyPenalty);
});
