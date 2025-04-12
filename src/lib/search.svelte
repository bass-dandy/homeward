<script lang="ts">
	import { onMount } from 'svelte';
	import { groupedLocations } from './helpers/consts';
	import Button from './button.svelte';
	import type { MapData } from './types';
	import type { MapState } from './map-state.svelte.ts';

	let {
		mapState = undefined,
		onLocationClick,
	}: {
		mapState?: MapState;
		onLocationClick: (locationName: string) => void;
	} = $props();

	let popover: HTMLDivElement;
	let searchValue = $state('');

	// groupedLocationsVisited should be calculated via $derived, but mapState.nodes is mutable and thus not reactive
	let groupedLocationsVisited = $state(groupedLocations);

	const updateLocationList = () => {
		const groupedLocationsFiltered = {};

		for (const [worldName, locationNames] of Object.entries(groupedLocations)) {
			const filteredLocationNames = locationNames.filter((locationName) =>
				mapState.nodes.get(locationName)?.label
			);
			if (filteredLocationNames.length > 0) {
				groupedLocationsFiltered[worldName] = filteredLocationNames;
			}
		}
		groupedLocationsVisited = groupedLocationsFiltered;
	};

	// make mapState reactive
	onMount(() => {
		if (!mapState) return;

		mapState?.nodes.on('add', updateLocationList);
		updateLocationList();
		return () => mapState?.nodes.off('add', updateLocationList);
	});

	// attach popover events
	onMount(() => {
		const clearSearch = () => {
			searchValue = '';
		};
		popover.addEventListener('beforetoggle', clearSearch);

		return () => popover.removeEventListener('beforetoggle', clearSearch);
	});

	let groupedLocationsVisitedFiltered = $derived.by(() => {
		if (!searchValue) return groupedLocationsVisited;

		return Object
			.entries(groupedLocationsVisited)
			.reduce((acc, [worldName, locationNames]) => {
				if (worldName.toLowerCase().includes(searchValue.toLowerCase())) {
					acc[worldName] = locationNames;
					return acc;
				}
				const filteredLocationNames = locationNames.filter((locationName) =>
					locationName.toLowerCase().includes(searchValue.toLowerCase())
				);
				if (filteredLocationNames.length > 0) {
					acc[worldName] = filteredLocationNames;
				}
				return acc;
			}, {} as Record<string, string[]>);
	});
</script>

<Button id="toggle" popovertarget="location-list-popover">
	Jump to location
</Button>

<div
	popover
	id="location-list-popover"
	bind:this={popover}
>
	<div class="border">
		<input
			type="text"
			placeholder="Search..."
			bind:value={searchValue}
		/>
		<dl>
			{#each Object.entries(groupedLocationsVisitedFiltered) as [worldName, locationNames] (worldName)}
				<dt>
					<img
						src={`/images/${worldName.toLowerCase().replace(/ /g, '-')}.webp`}
						alt=""
						width="80"
						height="96"
					/>
					{worldName}
				</dt>
				{#each locationNames as locationName}
					<dd>
						<button
							class="location-button"
							onclick={() => {
								onLocationClick(locationName);
								popover.hidePopover();
							}}
						>
							{locationName}
						</button>
					</dd>
				{/each}
			{/each}
		</dl>
	</div>
</div>

<style>
	:global(#toggle) {
		anchor-name: --toggleBtn;
	}

	#location-list-popover {
		position-anchor: --toggleBtn;
		top: anchor(bottom);
		right: 10px;
		display: flex;
		flex-direction: column;
		padding: 64px;
		margin: 25px 0 auto auto;
		border: 0;
		height: 600px;
		max-height: calc(100vh - 110px);
		box-sizing: border-box;
		background:
			linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
			url('/images/ui/splotch-tile.png');
		-webkit-mask-box-image: url('/images/ui/torn-border-mask-alpha.png')
			33% fill /          /* slice */
			80px /              /* width */
			0px                 /* outset */
			repeat;             /* repeat */
	}

	.border {
		display: flex;
		flex-direction: column;
		gap: 16px;
		flex: 1;
		overflow: hidden;
		border-image-source: url('/images/ui/gold-border.png');
		border-image-slice: 33%;
		border-image-width: 48px;
		border-image-outset: 48px;
		border-image-repeat: round;
	}

	input[type="text"] {
		padding: 8px;
		border-radius: 0;
		border: 1px solid var(--color-ui);
		background-color: var(--color-black);
		font-family: Matisse, serif;
		color: var(--color-text-primary);
	}

	input[type="text"]:focus {
		border-color: var(--color-ui-highlight);
		outline: none;
	}

	dl {
		display: flex;
		flex-direction: column;
		gap: 16px;
		list-style-type: none;
		flex: 1;
		padding: 0;
		margin: 0;
		overflow: auto;
	}

	dt {
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 4px double var(--color-accent);
		color: var(--color-text-secondary);
		font-size: 1.2rem;
	}

	dt > img {
		height: 40px;
		width: auto;
	}

	dd {
		margin: 0;
	}

	dd + dt {
		margin-top: 32px;
	}

	.location-button {
		display: block;
		position: relative;
		width: 100%;
		padding: 0;
		text-align: left;
		color: var(--color-text-primary);
		background-color: transparent;
		border: 0;
		font-family: Matisse, serif;
		font-size: 1rem;
	}

	.location-button::after {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		border: 1px solid var(--color-text-primary);
		border-radius: 50%;
	}

	.location-button:hover {
		cursor: pointer;
		background: radial-gradient(
			ellipse 50% 90% at center bottom,
			var(--color-ui-highlight),
			transparent
		);
	}
</style>
