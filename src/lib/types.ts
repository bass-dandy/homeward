export interface MapData {
	[location: string]: {
		scaling: string;
		isBoss: boolean;
		links: {
			location: string;
			isPreexisting: boolean;
			thereGate: string;
			hereGate: string | undefined;
		}[];
	};
}

export interface GraphNode {
	id: string;
	label: string;
	color: string;
}

export interface GraphEdge {
	id: string;
	from: string;
	to: string;
	color: string;
	arrows?: string;
	dashes: boolean;
	title: string;
}
