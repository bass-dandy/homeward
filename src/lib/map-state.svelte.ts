import { DataSet } from 'vis-data';
import type { MapData } from './types';

interface GraphNode {
	id: string;
	label: string;
	color: string;
}

interface GraphEdge {
	id: string;
	from: string;
	to: string;
	color: string;
	arrows?: string;
	dashes: boolean;
	title: string;
	label: string;
}

export class MapState {
	locationsByName: MapData;
	nodes: DataSet<GraphNode> = new DataSet();
	edges: DataSet<GraphEdge> = new DataSet();

	constructor(locationsByName: MapData, locationNames: string[]) {
		this.locationsByName = locationsByName;

		locationNames.forEach((locationName) => {
			this.addLocation(locationName);
		});
	}

	private getGraphDataForLocation = (locationName: string) => {
		const nodes: GraphNode[] = [];
		const edges: GraphEdge[] = [];

		const locationData = this.locationsByName[locationName];

		let color = 'rgb(200, 200, 255)';

		if (locationName === 'Cemetery of Ash') {
			// highlight starting location
			color = 'rgb(200, 255, 200)';
		} else if (locationData.links.length === 0) {
			// highlight dead ends
			color = 'yellow';
		} else if (locationData.isBoss) {
			// highlight boss locations
			color = 'rgb(255, 200, 200)';
		}

		nodes.push({
			id: locationName,
			label: locationName,
			color
		});

		locationData.links.forEach((link) => {
			edges.push({
				id: `${locationName}__${link.hereGate} --> ${link.location}__${link.thereGate}`,
				from: locationName,
				to: link.location,
				color: link.isPreexisting ? 'white' : 'rgb(237, 112, 45)',
				arrows: 'to',
				title: `${link.thereGate}${link.hereGate ? ` | ${link.hereGate}` : ''}`,
				label: link.itemRequirement ? `🔒 ${link.itemRequirement.name}` : '',
				dashes: link.isPreexisting
			});
		});

		return { nodes, edges };
	};

	addLocation = (locationName: string) => {
		const locationData = this.locationsByName[locationName];

		const newGraphData = this.getGraphDataForLocation(locationName);

		newGraphData.nodes.forEach((node) => {
			if (!this.nodes.get(node.id)) {
				this.nodes.add(node);
			}
		});
		newGraphData.edges.forEach((edge) => {
			if (!this.edges.get(edge.id)) {
				this.edges.add(edge);
			}
		});

		locationData.links.forEach((link) => {
			if (link.isPreexisting && !this.nodes.get(link.location)) {
				this.addLocation(link.location);
			}
		});
	};
}
