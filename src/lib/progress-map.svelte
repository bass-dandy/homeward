<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network } from 'vis-network';
	import { getGraphDataFromLocation } from '$lib/helpers/graph-data';
	import { parseLog } from '$lib/helpers/parse-log';
	import { log } from '$lib/consts';

	const mapData = parseLog(log);

	let el;

	const nodes = new DataSet([]);
	const edges = new DataSet([]);

	const addNode = (locationName: string) => {
		const locationData = mapData[locationName];

		const newGraphData = getGraphDataFromLocation(locationName, locationData);

		newGraphData.nodes.forEach(node => {
			if (!nodes.get(node.id)) {
				nodes.add(node)
			}
		});
		newGraphData.edges.forEach(edge => {
			if (!edges.get(edge.id)) {
				edges.add(edge);
			}
		});

		locationData.links.forEach((link) => {
			if (link.isPreexisting && !nodes.get(link.location)) {
				addNode(link.location);
			}
		});
	};

	onMount(() => {
		addNode('Cemetery of Ash');

		const network = new Network(el, { nodes, edges }, {
			nodes: { shape: 'box' },
			interaction: {
				hover: true,
				tooltipDelay: 0,
			},
			physics: {
				solver: 'repulsion',
				repulsion: {
					nodeDistance: 150,
				},
			},
		});

		network.on('click', (params) => {
			params.nodes.forEach((locationName) => {
				console.log(params);
				const { links } = mapData[locationName];
				links.forEach((link) => addNode(link.location));
			});
		});
	});
</script>

<div bind:this={el}></div>

<style>
	div {
		width: 100vw;
		height: 100vh;
	}
</style>
