/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { ParkInfo } from "../../src/core/parkInfo";
import { ParkRating } from "../../src/core/parkRating";


const difficultyEffect = "Difficulty";
const numberOfGuestsEffect = "Guests";
const happyGuestsEffect = "Happy";
const lostGuestsEffect = "Lost";
const rideUptimeEffect = "uptime";
const rideAverageExcitementEffect = "Average ride excitement";
const rideAverageIntensityEffect = "Average ride intensity";
const rideTotalExcitementEffect = "Total ride excitement";
const rideTotalIntensityEffect = "Total ride intensity";
const litterEffect = "litter";
const casualtyEffect = "Casualty";


test("All effects are valid and active", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.hasDifficultParkRating = true;
	ParkInfo.guests = { total: 100, happy: 50, lost: 20 };
	ParkInfo.rides = { total: 10, uptime: 80, excitement: 100, intensity: 50, withRatings: 8 };
	ParkInfo.litter = 50;
	ParkInfo.casualtyPenalty = 25;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	t.is(rating.effects.length, 11);
	t.true(rating.effects.every(e => e.active));
	t.true(rating.effects.every(e => e.name));
	t.true(rating.effects.every(e => e.value));
	t.true(rating.effects.every(e => e.note));
});


test("Difficult rating is enabled", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.hasDifficultParkRating = true;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(difficultyEffect));
	t.is(effect?.value, "enabled");
	t.is(effect?.impact, -100);
});


test("Difficult rating is disabled", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.hasDifficultParkRating = false;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(difficultyEffect));
	t.is(effect, undefined); // gone
});


test("Difficult rating is enabled then disabled then enabled", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.hasDifficultParkRating = true;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect1 = rating.effects.find(e => e.name.includes(difficultyEffect));
	t.true(effect1?.active);

	ParkInfo.hasDifficultParkRating = false;
	rating.recalculate();

	const effect2 = rating.effects.find(e => e.name.includes(difficultyEffect));
	t.is(effect2, undefined); // gone

	ParkInfo.hasDifficultParkRating = true;
	rating.recalculate();

	const effect3 = rating.effects.find(e => e.name.includes(difficultyEffect));
	t.true(effect3?.active);
});


test("Total guests", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.total = 1310;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(numberOfGuestsEffect));
	t.true(effect?.value.includes("1310"), effect?.value);
	t.is(effect?.impact, 100);
});


test("Total guests: cap at 2000", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.total = 2600;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(numberOfGuestsEffect));
	t.true(effect?.value.includes("2600"), effect?.value);
	t.is(effect?.impact, 153);
});


test("Happy guests: 100% happiness", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.total = 500;
	ParkInfo.guests.happy = 500;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(happyGuestsEffect));
	t.true(effect?.value.includes("500/500"), effect?.value);
	t.is(effect?.impact, 500);
});


test("Happy guests: 50% happiness", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.total = 500;
	ParkInfo.guests.happy = 250;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(happyGuestsEffect));
	t.true(effect?.value.includes("250/500"), effect?.value);
	t.is(effect?.impact, 300);
});


test("Happy guests: 0% happiness", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.total = 500;
	ParkInfo.guests.happy = 0;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(happyGuestsEffect));
	t.true(effect?.value.includes("0/500"), effect?.value);
	t.is(effect?.impact, 0);
});


test("Lost guests: 500", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.lost = 500;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(lostGuestsEffect));
	t.true(effect?.value.includes("500"), effect?.value);
	t.is(effect?.impact, -7 * 475);
});


test("Lost guests: 25, no impact", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.guests.lost = 25;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(lostGuestsEffect));
	t.true(effect?.value.includes("25"), effect?.value);
	t.is(effect?.impact, 0);
});


test("Ride uptime: 100%", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 10;
	ParkInfo.rides.uptime = 1000;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(rideUptimeEffect));
	t.true(effect?.value.includes("100%"), effect?.value);
	t.is(effect?.impact, 200);
});


test("Ride uptime: 50%", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 10;
	ParkInfo.rides.uptime = 500;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(rideUptimeEffect));
	t.true(effect?.value.includes("50%"), effect?.value);
	t.is(effect?.impact, 100);
});


test("Ride uptime: 0%", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 10;
	ParkInfo.rides.uptime = 0;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(rideUptimeEffect));
	t.true(effect?.value.includes("0%"), effect?.value);
	t.is(effect?.impact, 0);
});


test("Ride average excitement & intensity: perfect", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 15;
	ParkInfo.rides.withRatings = 10;
	ParkInfo.rides.excitement = 460;
	ParkInfo.rides.intensity = 650;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect1 = rating.effects.find(e => e.name.includes(rideAverageExcitementEffect));
	t.true(effect1?.value.includes("3.68/3.68"), effect1?.value);
	t.is(effect1?.impact, 50);

	const effect2 = rating.effects.find(e => e.name.includes(rideAverageIntensityEffect));
	t.true(effect2?.value.includes("5.20/5.20"), effect2?.value);
	t.is(effect2?.impact, 50);
});


test("Ride average excitement & intensity: single Crooked House", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 5;
	ParkInfo.rides.withRatings = 1;
	ParkInfo.rides.excitement = Math.floor(215 / 8);
	ParkInfo.rides.intensity = Math.floor(62 / 8);

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	// NOTE: Slightly different from input because of divide by 8 and flooring. This reflects the game's algorithm.
	const effect1 = rating.effects.find(e => e.name.includes(rideAverageExcitementEffect));
	t.true(effect1?.value.includes("2.08/3.68"), effect1?.value);
	t.is(effect1?.impact, 40);

	const effect2 = rating.effects.find(e => e.name.includes(rideAverageIntensityEffect));
	t.true(effect2?.value.includes("0.56/5.20"), effect2?.value);
	t.is(effect2?.impact, 21);
});


test("Ride total excitement & intensity: perfect", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 15;
	ParkInfo.rides.withRatings = 10;
	ParkInfo.rides.excitement = 1000;
	ParkInfo.rides.intensity = 1000;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect1 = rating.effects.find(e => e.name.includes(rideTotalExcitementEffect));
	t.true(effect1?.value.includes("80.0/80.0"), effect1?.value);
	t.is(effect1?.impact, 100);

	const effect2 = rating.effects.find(e => e.name.includes(rideTotalIntensityEffect));
	t.true(effect2?.value.includes("80.0/80.0"), effect2?.value);
	t.is(effect2?.impact, 100);
});


test("Ride total excitement & intensity: single Crooked house", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.rides.total = 15;
	ParkInfo.rides.withRatings = 10;
	ParkInfo.rides.excitement = Math.floor(215 / 8);
	ParkInfo.rides.intensity = Math.floor(62 / 8);

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect1 = rating.effects.find(e => e.name.includes(rideTotalExcitementEffect));
	t.true(effect1?.value.includes("2.1/80.0"), effect1?.value);
	t.is(effect1?.impact, 2);

	const effect2 = rating.effects.find(e => e.name.includes(rideTotalIntensityEffect));
	t.true(effect2?.value.includes("0.6/80.0"), effect2?.value);
	t.is(effect2?.impact, 0);
});


test("Litter: some", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.litter = 50;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(litterEffect));
	t.true(effect?.value.includes("50/150"), effect?.value);
	t.is(effect?.impact, -4 * 50);
});


test("Litter: maximum", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.litter = 150;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(litterEffect));
	t.true(effect?.value.includes("150/150"), effect?.value);
	t.is(effect?.impact, -4 * 150);
});


test("Litter: none", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.litter = 0;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(litterEffect));
	t.true(effect?.value.includes("0/150"), effect?.value);
	t.true(0 === effect?.impact, `${effect?.impact}`);
});


test("Casualty penalty: maximum", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.casualtyPenalty = 1000;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(casualtyEffect));
	t.true(effect?.value.includes("1000/1000"), effect?.value);
	t.is(effect?.impact, -1000);
});


test("Casualty penalty: none", t =>
{
	ParkInfo.refresh = (): void => {};
	ParkInfo.casualtyPenalty = 0;

	const rating = ParkRating.for(ParkInfo);
	rating.recalculate();

	const effect = rating.effects.find(e => e.name.includes(casualtyEffect));
	t.true(effect?.value.includes("0/1000"), effect?.value);
	t.true(0 === effect?.impact, `${effect?.impact}`);
});