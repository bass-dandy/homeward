export interface MapData {
	[location: string]: {
		scaling: string;
		isBoss: boolean;
		links: {
			location: string;
			isPreexisting: boolean;
			itemRequirement?: {
				name: string;
				location: string;
			};
			thereGate: string;
			hereGate?: string;
		}[];
	};
}
