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
			'Copying',
			'\r'
		];

		return line.length && !ignoreList.some((prefix) => line.startsWith(prefix));
	});

	const mapData: MapData = {};

	// lines that denote new locations are not indented
	const locationLines = lines.filter((line) => !line.startsWith('  '));

	// lines that denote links between locations are indented
	const linkLines = lines.filter((line) => line.startsWith('  '));

	locationLines.forEach((line) => {
		mapData[getLocation(line)] = {
			scaling: getScaling(line),
			isBoss: getIsBoss(line),
			links: []
		};
	});

	linkLines.forEach((line) => {
		const [from, to] = removeParens(line)
			.trim()
			.split(/(?<!door|dropping down) to (.*)/s);

		// toGate will be undefined for preexisting routes
		const [fromGate, toGate] = getGates(line);

		const fromLocation = getLocation(from);

		if (!mapData[fromLocation]) {
			throw new Error(`Parse error: undefined source location "${fromLocation}" in line "${line}"`);
		}

		mapData[fromLocation].links.push({
			location: getLocation(to),
			isPreexisting: line.includes('Preexisting:'),
			thereGate: toGate,
			hereGate: fromGate,
			itemRequirement: getItemRequirement(line)
		});
	});

	return mapData;
}
