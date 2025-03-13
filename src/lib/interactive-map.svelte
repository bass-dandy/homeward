<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network } from 'vis-network';
	import Button from './button.svelte';
	import ForceGraph from './force-graph.svelte';
	import { MapState } from './map-state.svelte.ts';
	import type { MapData } from './types';

	let { locationsByName }: { locationsByName: MapData } = $props();

	let activeView: 'progress' | 'full' = $state('progress');

	const progressMapState = new MapState(locationsByName, ['Cemetery of Ash']);
	const fullMapState = new MapState(locationsByName, Object.keys(locationsByName));
</script>

<div class="map" class:active={activeView === 'progress'}>
	<ForceGraph
		nodes={progressMapState.nodes}
		edges={progressMapState.edges}
		onNodeClick={(locationName) => {
			const { links } = locationsByName[locationName];
			links.forEach((link) => progressMapState.addLocation(link.location));
		}}
	/>
</div>
<div class="map" class:active={activeView === 'full'}>
	<ForceGraph
		nodes={fullMapState.nodes}
		edges={fullMapState.edges}
	/>
</div>

<div class="button">
	<Button
		onclick={() => {
			activeView = activeView === 'progress' ? 'full' : 'progress';
		}}
	>
		{activeView === 'progress' ? 'Show full map' : 'Show progress'}
	</Button>
</div>

<style>
	.map:not(.active) {
		display: none;
	}

	.button {
		position: fixed;
		top: 10px;
		left: 10px;
		z-index: 1;
	}
</style>
