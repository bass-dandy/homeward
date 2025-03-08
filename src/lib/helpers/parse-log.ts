import type { MapData } from '../types';

export function getScaling(line: string) {
	return line.match(/\d*%/)?.[0] || 'undefined';
}

export function getIsBoss(line: string) {
	return line.includes('<----');
}

export function removeParens(line: string) {
	return line.replace(/\([^)]*\)/g, '');
}

export function getLocation(line: string) {
	return removeParens(line)
		.replace('Preexisting: From', '')
		.replace('Random: From', '')
		.replace('<----', '')
		.trim();
}

export function getGates(line: string) {
	return (
		line.match(/\([^)]*\)/g)?.map((gate) => {
			return gate.replace('(', '').replace(')', '');
		}) ?? []
	);
}

export function validateMapData(mapData: MapData) {
	Object.values(mapData).forEach((location) => {
		location.links.forEach((link) => {
			if (!mapData[link.location]) {
				console.log(`Location ${link.location} does not exist (from ${location})`);
			}
		});
	});
}

export function invertLinks(mapData: MapData) {
	const invertedMapData: MapData = {};

	// ensure all locations are defined
	Object.entries(mapData).forEach(([locationName, locationData]) => {
		invertedMapData[locationName] = {
			scaling: locationData.scaling,
			isBoss: locationData.isBoss,
			links: []
		};
	});

	// for link in each location...
	// 1. move the link to its linked location
	// 2. change its location to the current location
	Object.entries(mapData).forEach(([locationName, locationData]) => {
		locationData.links.forEach((link) => {
			invertedMapData[link.location].links.push({
				location: locationName,
				isPreexisting: link.isPreexisting,
				thereGate: link.thereGate,
				hereGate: link.hereGate
			});
		});
	});

	validateMapData(invertedMapData);
	return invertedMapData;
}

export function parseLog(log: string) {
	const lines = log.split('\n').filter((line) => {
		const ignoreList = [
			'Seed:',
			'Key item hash:',
			'Areas required before Firelink Shrine:',
			'Other areas are not necessary to get there.',
			'>>>',
			'Finished',
			'Using',
			'Writing',
			'Processing',
			'Copying'
		];

		return line.length && !ignoreList.some((prefix) => line.startsWith(prefix));
	});

	const mapData: MapData = {};

	lines.forEach((line) => {
		if (!line.startsWith('  ')) {
			// this is a new location
			mapData[getLocation(line)] = {
				scaling: getScaling(line),
				isBoss: getIsBoss(line),
				links: []
			};
		} else {
			// this is a route to an existing location
			const [there, here] = removeParens(line)
				.trim()
				.split(/ to (.*)/s);

			// hereGate will be undefined for preexisting routes
			const [thereGate, hereGate] = getGates(line);

			mapData[getLocation(here)].links.push({
				location: getLocation(there),
				isPreexisting: line.includes('Preexisting:'),
				thereGate,
				hereGate
			});
		}
	});

	validateMapData(mapData);
	return invertLinks(mapData);
}
