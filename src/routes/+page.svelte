<script lang="ts">
	import InteractiveMap from '$lib/interactive-map.svelte';
	import Dialog from '$lib/dialog.svelte';
	import FileInput from '$lib/file-input.svelte';
	import type { MapData } from '$lib/types';

	let locationsByName: MapData | undefined = $state();
</script>

{#if locationsByName}
	<InteractiveMap {locationsByName} />
{:else}
	<Dialog>
		<div class="dialog-content">
			<h1>Homeward</h1>
			Interactive map for Dark Souls 3 fog gate randomizer
			<div class="hr"></div>
			<FileInput
				onMapDataLoad={(mapData) => {
					locationsByName = mapData;
				}}
			/>
		</div>
	</Dialog>
{/if}

<style>
	:global(:root) {
		--color-text-primary: rgb(188, 188, 188);
		--color-text-secondary: rgb(155, 135, 102);
		--color-accent: rgb(100, 85, 53);
		--color-ui: rgb(106, 67, 33);
		--color-ui-highlight: rgb(237, 112, 45);
	}

	:global(body, html) {
		font-family: 'Matisse', serif;
		margin: 0;
		padding: 0;
		background-color: rgb(25, 20, 15);
	}

	.dialog-content {
		text-align: center;
		padding-bottom: 8px;
	}

	h1 {
		margin: 0;
		padding: 0;
		font-size: 1.5rem;
		color: var(--color-text-secondary);
	}

	.hr {
		display: block;
		height: 2px;
		background-color: var(--color-accent);
		border-radius: 50%;
		margin: 8px -20px 16px;
	}
</style>
