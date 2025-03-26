<script lang="ts">
	let buttonProps = $props();
</script>

<div class="button-wrapper">
	<button {...buttonProps}>
		<slot />
	</button>
</div>

<style>
	.button-wrapper {
		display: inline-block;
		position: relative;
		padding: 4px;
	}

	.button-wrapper::before, .button-wrapper::after {
		content: '';
		display: block;
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.button-wrapper::before {
		border: 2px solid var(--color-ui);
		mask-image: url('/images/ui/noise.jpg');
		mask-mode: luminance;
		mask-size: cover;
	}

	.button-wrapper::after {
		box-shadow: inset 0 0 10px 0 var(--color-ui-highlight);
		opacity: 0;
		transition: opacity 0.075s ease-out;
	}

	.button-wrapper:hover::after {
		opacity: 1;
	}

	button {
		display: block;
		cursor: pointer;
		background: transparent;
		padding: 0 16px;
		border: 1px solid var(--color-ui);
		border-radius: 0;
		color: var(--color-text-primary);
		font-family: 'Matisse', serif;
		text-transform: uppercase;
	}
</style>
