<script lang="ts">
	import topLeft from '../images/ui/border-top-left.png';
	import topDeco from '../images/ui/border-top-deco.png';
	import topCenter from '../images/ui/border-top-center.png';
	import topRight from '../images/ui/border-top-right.png';
	import bottomLeft from '../images/ui/border-bottom-left.png';
	import bottomDeco from '../images/ui/border-bottom-deco.png';
	import bottomCenter from '../images/ui/border-bottom-center.png';
	import bottomRight from '../images/ui/border-bottom-right.png';

	let {
		position = 'center',
		children,
	}: {
		position: 'center' | 'bottom';
		children: () => any;
	}= $props();
</script>

<div class={`dialog ${position}`}>
	<div class="border-top">
		<img src={topLeft} width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={topDeco} width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={topCenter} width="100" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={topDeco} width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={topRight} width="50" height="9" alt="">
	</div>
	<div class="content">
		{@render children?.()}
	</div>
	<div class="border-bottom">
		<img src={bottomLeft} width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={bottomDeco} width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={bottomCenter} width="100" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={bottomDeco} width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src={bottomRight} width="50" height="9" alt="">
	</div>
</div>

<style>
	.dialog {
		position: fixed;
	}

	.dialog.center {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.dialog.bottom {
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
	}

	.content {
		background-color: black;
		color: var(--color-text-primary);
		padding: 8px 48px;
		mask-image: linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent);
		background:
			linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
			url('../images/ui/splotch-tile.png'),
			linear-gradient(black, black);
	}

	.border-top, .border-bottom {
		position: relative;
		display: flex;
		margin: 0 -10px;
		height: 9px;
		z-index: 1;
	}

	.border-top {
		top: 6px;
	}

	.border-bottom {
		bottom: 5px;
	}

	.border-stretch {
		flex: 1;
		background-repeat: repeat-x;
		height: 100%;
	}

	.border-top .border-stretch {
		background-image: url('../images/ui/border-top-stretch.png');
	}

	.border-bottom .border-stretch {
		background-image: url('../images/ui/border-bottom-stretch.png');
	}

	.border-top img, .border-bottom img {
		pointer-events: none;
		user-select: none;
	}
</style>
