<script lang="ts">
	import menuLogo from '../images/menu.png';
	import { MapState } from './map-state.svelte.ts';

	let { activeMapState }: { activeMapState: MapState } = $props();
</script>

<div class="header">
	<div class="stripe"></div>
	<div class="header-content">
		<div class="section">
			<img src={menuLogo} alt="" height="90" width ="90" />
			<h1>Homeward</h1>
		</div>
		<div class="section">
			<slot />
		</div>
	</div>
</div>

<style>
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
		mask-mode: alpha;
		mask-position: bottom;
		mask-repeat: repeat-x;
		mask-size: auto, auto 5px;
		mask-image:
			linear-gradient(to bottom, black 0%, black calc(100% - 5px), transparent, transparent 100%),
			url('../images/ui/torn-edge-mask-alpha.png');
		background:
			linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.9)),
			url('../images/ui/splotch-tile.png'),
			linear-gradient(black, black);
	}

	.stripe {
		position: relative;
		height: 20px;
		width: 100%;
		border-bottom: 2px dotted var(--color-ui);
		mask-image: url('../images/ui/noise.jpg');
		mask-mode: luminance;
		mask-size: 10%;
	}

	.stripe::after {
		content: '';
		display: block;
		position: absolute;
		bottom: 4px;
		width: 100%;
		border-bottom: 2px solid var(--color-ui);
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 64px;
	}

	.section {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	img {
		height: 40px;
		width: auto;
	}

	h1 {
		padding: 0;
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-text-secondary);
	}
</style>
