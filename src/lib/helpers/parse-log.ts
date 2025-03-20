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

export function getItemRequirement(line: string) {
	let name: string | undefined;
	let location: string | undefined;

	if (line.includes('Preexisting:')) {
		// item-gated preexisting paths have a consistent format
		const match = line.match(
			/(?<=using |embedding |locked by |attempting to use |placing all ).*an item from [^)]*/
		)?.[0];

		if (match) {
			[name, location] = match.split(', an item from ');
		}
	} else if (line.includes('Random:')) {
		// item-gated random warps do not have a consistent format, but there are only 3
		if (line.includes('From Vordt of the Boreal Valley (transport after Vordt)')) {
			name = 'Small Lothric Banner';
		} else if (line.includes('From Irithyll Dungeon (warp to Archdragon Peak)')) {
			name = 'Path of the Dragon';
		} else if (line.includes('From after Demon Prince (transport after Demon Prince)')) {
			name = 'Small Envoy Banner';
		}
		location = line.match(/(?<=, an item from )[^\)]*/)?.[0];
	}

	return name && location ? { name, location } : undefined;
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
	// 3. swap hereGate and thereGate
	Object.entries(mapData).forEach(([locationName, locationData]) => {
		locationData.links.forEach((link) => {
			invertedMapData[link.location].links.push({
				location: locationName,
				isPreexisting: link.isPreexisting,
				itemRequirement: link.itemRequirement,
				thereGate: link.hereGate,
				hereGate: link.thereGate
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

	// lines that denote new locations
	const locationLines = lines.filter((line) => !line.startsWith('  '));

	// lines that denote links between locations
	const linkLines = lines.filter((line) => line.startsWith('  '));

	locationLines.forEach((line) => {
		mapData[getLocation(line)] = {
			scaling: getScaling(line),
			isBoss: getIsBoss(line),
			links: []
		};
	});

	linkLines.forEach((line) => {
		const [there, here] = removeParens(line)
			.trim()
			.split(/(?<!door|dropping down) to (.*)/s);

		// hereGate will be undefined for preexisting routes
		const [thereGate, hereGate] = getGates(line);

		const itemRequirement = getItemRequirement(line);

		console.log(`here: ${here}, there: ${there}, full: ${line}`);

		mapData[getLocation(here)].links.push({
			location: getLocation(there),
			isPreexisting: line.includes('Preexisting:'),
			itemRequirement,
			thereGate,
			hereGate
		});
	});

	validateMapData(mapData);
	return invertLinks(mapData);
}
