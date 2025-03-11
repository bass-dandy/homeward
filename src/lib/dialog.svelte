<div class="dialog">
	<div class="border-top">
		<img src="/images/ui/border-top-left.png" width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-top-deco.png" width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-top-center.png" width="100" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-top-deco.png" width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-top-right.png" width="50" height="9" alt="">
	</div>
	<div class="content">
		<slot />
	</div>
	<div class="border-bottom">
		<img src="/images/ui/border-bottom-left.png" width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-bottom-deco.png" width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-bottom-center.png" width="100" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-bottom-deco.png" width="50" height="9" alt="">
		<div class="border-stretch"></div>
		<img src="/images/ui/border-bottom-right.png" width="50" height="9" alt="">
	</div>
</div>

<style>
	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.content {
		background-color: black;
		color: var(--color-text-primary);
		padding: 16px 48px;
		mask-image: linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent);
		background:
			linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
			url('/images/ui/splotch-tile.png'),
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
		background-image: url('/images/ui/border-top-stretch.png');
	}

	.border-bottom .border-stretch {
		background-image: url('/images/ui/border-bottom-stretch.png');
	}

	.border-top img, .border-bottom img {
		pointer-events: none;
		user-select: none;
	}
</style>
