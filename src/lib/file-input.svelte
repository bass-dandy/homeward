<script lang="ts">
	import { parseLog } from '$lib/helpers/parse-log';
	import type { MapData } from '$lib/types';
	import Button from './button.svelte';

	const { onMapDataLoad }: {
		onMapDataLoad: (mapData: MapData) => void;
	} = $props();

	let fileInput: HTMLInputElement;
</script>

<div class="container">
	<input
		id="upload"
		type="file"
		accept=".txt"
		bind:this={fileInput}
		on:change={async () => {
			const file = fileInput.files?.[0];

			if (file) {
				const txt = await file.text();
				onMapDataLoad(parseLog(txt));
			}
		}}
	/>
	<Button onclick={() => fileInput.click()}>
		Upload spoiler log
	</Button>
</div>

<style>
	.container {
		display: inline-block;
	}

	input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
</style>
