<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network } from 'vis-network';

	let {
		nodes = $bindable(),
		edges = $bindable(),
		onNodeClick,
	}: {
		nodes: DataSet;
		edges: DataSet;
		onNodeClick: (locationName: string) => void;
	} = $props();

	let mountPoint: HTMLDivElement;

	onMount(() => {
		const network = new Network(mountPoint, { nodes, edges }, {
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

		if (onNodeClick) {
			network.on('click', (params) => {
				params.nodes.forEach((locationName) => {
					onNodeClick(locationName);
				});
			});
		}
	});
</script>

<div bind:this={mountPoint}></div>

<style>
	div {
		width: 100vw;
		height: 100vh;
	}
</style>
