import type { MapData } from '../types';

interface Node {
	id: string;
	label: string;
	color: string;
}

interface Edge {
	id: string;
	from: string;
	to: string;
	color: string;
	arrows?: string;
	dashes: boolean;
	title: string;
}

export function getGraphDataFromLocation(locationName: string, locationData: MapData[string]) {
	const nodes: Node[] = [];
	const edges: Edge[] = [];

	nodes.push({
		id: locationName,
		label: locationName,
		color:
			locationName === 'Cemetery of Ash'
				? 'green'
				: locationData.links.length === 0
					? 'yellow'
					: locationData.isBoss
						? 'rgba(255, 0, 0, 0.5)'
						: 'rgba(0, 0, 255, 0.5)'
	});

	locationData.links.forEach((link) => {
		edges.push({
			id: `${locationName}__${link.hereGate} --> ${link.location}__${link.thereGate}`,
			from: locationName,
			to: link.location,
			color: link.isPreexisting ? 'black' : 'red',
			arrows: link.isPreexisting ? undefined : 'to, from',
			title: `${link.thereGate}${link.hereGate ? ` | ${link.hereGate}` : ''}`,
			dashes: link.isPreexisting
		});
	});

	return { nodes, edges };
}

export function getFullGraph(mapData: MapData) {
	const nodes: Node[] = [];
	const edges: Edge[] = [];

	Object.entries(mapData).forEach(([locationName, locationData]) => {
		const graphData = getGraphDataFromLocation(locationName, locationData);
		nodes.push(...graphData.nodes);
		edges.push(...graphData.edges);
	});

	return { nodes, edges };
}
