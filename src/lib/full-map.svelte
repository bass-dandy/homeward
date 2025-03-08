<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network } from 'vis-network';
	import { getFullGraph } from '$lib/helpers/graph-data';
	import { parseLog } from '$lib/helpers/parse-log';
	import { log } from '$lib/consts';

	const mapData = parseLog(log);

	let el;

	const graphData = getFullGraph(mapData);
	const nodes = new DataSet(graphData.nodes);
	const edges = new DataSet(graphData.edges);

	onMount(() => {
		new Network(el, { nodes, edges }, {
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
	});
</script>

<div bind:this={el}></div>

<style>
	div {
		width: 100vw;
		height: 100vh;
	}
</style>
