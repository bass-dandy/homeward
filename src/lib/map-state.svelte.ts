import { DataSet } from 'vis-data';
import type { MapData } from './types';

interface GraphNode {
	id: string;
	label: string;
	color: string;
	shape?: string;
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
			this.visitLocation(locationName);
		});
	}

	private getLinks = (locationName: string) => {
		const nodes: GraphNode[] = [];
		const edges: GraphEdge[] = [];

		const locationData = this.locationsByName[locationName];

		locationData.links.forEach((link) => {
			nodes.push({
				id: link.location,
				label: '',
				color: 'red',
				shape: 'circle'
			});
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

	private getNodeColor = (locationName: string) => {
		const locationData = this.locationsByName[locationName];

		if (locationName === 'Cemetery of Ash') {
			// highlight starting location
			return 'rgb(200, 255, 200)';
		} else if (locationData.isBoss) {
			// highlight boss locations
			return 'rgb(255, 200, 200)';
		}

		return 'rgb(200, 200, 255)';
	};

	visitLocation = (locationName: string) => {
		const thisNode = this.nodes.get(locationName);
		const color = this.getNodeColor(locationName);

		if (!thisNode) {
			this.nodes.add({
				id: locationName,
				label: locationName,
				color
			});
		} else if (thisNode.label === '') {
			this.nodes.updateOnly({
				id: locationName,
				label: locationName,
				shape: 'box',
				color
			});
		}

		const links = this.getLinks(locationName);

		links.nodes.forEach((node) => {
			if (!this.nodes.get(node.id)) {
				this.nodes.add(node);
			}
		});

		links.edges.forEach((edge) => {
			if (!this.edges.get(edge.id)) {
				this.edges.add(edge);
			}
		});
	};
}
