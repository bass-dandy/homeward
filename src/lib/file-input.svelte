<script lang="ts">
	import { parseLog } from '$lib/helpers/parse-log';
	import type { MapData } from '$lib/types';
	import Button from './button.svelte';

	const { onMapDataLoad }: {
		onMapDataLoad: (mapData: MapData) => void;
	} = $props();

	let error: string = $state('');
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
				try {
					error = '';
					const txt = await file.text();
					onMapDataLoad(parseLog(txt));
				} catch (e) {
					error = e.message;
				}
			}
		}}
	/>
	<Button onclick={() => fileInput.click()}>
		Upload spoiler log
	</Button>
	{#if error}
		<p class="error">{error}</p>
	{/if}
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

	.error {
		color: var(--color-ui-highlight);
		margin: 8px 0 0;
		padding: 0;
		font-size: 0.75rem;
	}
</style>
