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
