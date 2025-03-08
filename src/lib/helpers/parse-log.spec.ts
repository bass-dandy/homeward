import { describe, it, expect } from 'vitest';
import { getScaling, getIsBoss, removeParens, getLocation, getGates } from './parse-log';

const LOCATIONS = {
	boss: 'Slave Knight Gael (scaling: 29%) <----',
	nonBoss: 'Archdragon Peak Start (scaling: 47%)',
	randomWarp:
		'Random: From after Halflight (waking up Filianore) to Undead Settlement (transport after Vordt)',
	preexistingPath:
		'Preexisting: From Undead Settlement Tower to Undead Settlement (dropping down with Siegward)'
};

describe('getScaling', () => {
	it('parses a scaling string from a non-boss location', () => {
		expect(getScaling(LOCATIONS.nonBoss)).toBe('47%');
	});

	it('parses a scaling string from a boss location', () => {
		expect(getScaling(LOCATIONS.boss)).toBe('29%');
	});
});

describe('getIsBoss', () => {
	it('returns true if the line contains "<----"', () => {
		expect(getIsBoss(LOCATIONS.boss)).toBe(true);
	});

	it('returns false if the line does not contain "<----"', () => {
		expect(getIsBoss(LOCATIONS.nonBoss)).toBe(false);
	});
});

describe('removeParens', () => {
	it('removes all text inside parentheses from a location string', () => {
		expect(removeParens(LOCATIONS.boss)).toBe('Slave Knight Gael  <----');
	});

	it('removes all text inside parentheses from a warp string', () => {
		expect(removeParens(LOCATIONS.randomWarp)).toBe(
			'Random: From after Halflight  to Undead Settlement '
		);
	});
});

describe('getLocation', () => {
	it('extracts location from non-boss location string', () => {
		expect(getLocation(LOCATIONS.nonBoss)).toBe('Archdragon Peak Start');
	});

	it('extracts location from boss location string', () => {
		expect(getLocation(LOCATIONS.boss)).toBe('Slave Knight Gael');
	});

	it('extracts location from random warp string', () => {
		expect(getLocation('Random: From after Halflight ')).toBe('after Halflight');
	});

	it('extracts location from preexisting path string', () => {
		expect(getLocation('Preexisting: From Undead Settlement Tower ')).toBe(
			'Undead Settlement Tower'
		);
	});
});

describe('getGates', () => {
	it('extracts gates from a random warp string', () => {
		expect(getGates(LOCATIONS.randomWarp)).toEqual([
			'waking up Filianore',
			'transport after Vordt'
		]);
	});

	it('extracts gates from a preexisting path string', () => {
		expect(getGates(LOCATIONS.preexistingPath)).toEqual(['dropping down with Siegward']);
	});
});
