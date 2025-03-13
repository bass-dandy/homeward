<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network } from 'vis-network';
	import { getGraphDataFromLocation } from './helpers/graph-data';
	import ForceGraph from './force-graph.svelte';
	import type { MapData } from './types';

	let { locationsByName }: { locationsByName: MapData } = $props();

	let nodes = $state(new DataSet([]));
	let edges = $state(new DataSet([]));

	const addNode = (locationName: string) => {
		const locationData = locationsByName[locationName];

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

	addNode('Cemetery of Ash');
</script>

<ForceGraph
	bind:nodes
	bind:edges
	onNodeClick={(locationName) => {
		const { links } = locationsByName[locationName];
		links.forEach((link) => addNode(link.location));
	}}
/>
