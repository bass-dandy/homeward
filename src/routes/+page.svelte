<script lang="ts">
	import FullMap from '$lib/full-map.svelte';
	import ProgressMap from '$lib/progress-map.svelte';
</script>

<FullMap />

<style>
	:global(:root){
		--color-text-primary: rgb(188, 188, 188);
		--color-text-secondary: rgb(155, 135, 102);
	}

	:global(body, html) {
		font-family: 'Matisse', serif;
		margin: 0;
		padding: 0;
		background-color: #444;
	}
</style>
