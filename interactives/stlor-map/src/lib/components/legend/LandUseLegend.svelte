<script lang="ts">
	import { opacifyHex } from '$lib/utils/color';
	import { LAND_USE_TO_COLORS } from '$lib/utils/constants';
</script>

<h2 class="text-base sm:text-lg">Land uses</h2>
<h3 class="font-sans-alt text-sm sm:text-base">Color</h3>
<div class="grid grid-cols-2 gap-1">
	{#each Object.entries(LAND_USE_TO_COLORS) as [landUse, color]}
		<div class="stack-h stack-h-xs items-center">
			<div
				class="h-4 w-4 border sm:h-5 sm:w-5"
				style="background-color: {opacifyHex(color, 0.75)}; border-color: {color};"
			/>
			<span class="font-sans-alt text-2xs sm:text-sm">{landUse}</span>
		</div>
	{/each}
</div>
<h3 class="font-sans-alt text-sm sm:text-base">Pattern</h3>
<div class="stack-h stack-h-xs items-center">
	<div class="h-4 w-4 sm:h-5 sm:w-5">
		<svg viewBox="0 0 36 36" width="36" height="36" class="h-auto max-w-full">
			<path d="M0,24 L12,36 L0,36, z" fill="#3c3830" />
			<path d="M0,12 L24,36 L12,36, L0,24 z" fill="#ffffff" fill-opacity="0.75" />
			<path d="M0,0 L36,36 L24,36, L0,12 z" fill="#3c3830" fill-opacity="0.75" />
			<path d="M12,0 L36,24 L36,36, 0,0 z" fill="#ffffff" fill-opacity="0.75" />
			<path d="M24,0 L36,12 L36,24, L12,0 z" fill="#3c3830" fill-opacity="0.75" />
			<path d="M24,0 L36,0 L36,12 z" fill="#ffffff" fill-opacity="0.75" />
		</svg>
	</div>
	<span class="font-sans-alt text-2xs sm:text-sm">Two land uses</span>
</div>
<div class="stack-h stack-h-xs items-center">
	<div class="h-4 w-4 sm:h-5 sm:w-5">
		<svg viewBox="0 0 36 36" width="36" height="36" class="h-auto max-w-full">
			<rect x="0" y="0" width="36" height="12" fill="#3c3830" fill-opacity="0.75" />
			<rect x="0" y="12" width="36" height="12" fill="#808080" fill-opacity="0.75" />
			<rect x="0" y="24" width="36" height="12" fill="#ffffff" fill-opacity="0.75" />
		</svg>
	</div>
	<span class="font-sans-alt text-2xs sm:text-sm">Three land uses</span>
</div>
<div class="stack-h stack-h-xs items-center">
	<div class="h-4 w-4 sm:h-5 sm:w-5">
		<svg viewBox="0 0 36 36" width="36" height="36" class="h-auto max-w-full">
			<rect x="0" y="0" width="8" height="36" fill="#3c3830" fill-opacity="0.75" />
			<rect x="8" y="0" width="8" height="36" fill="#545454" fill-opacity="0.75" />
			<rect x="16" y="0" width="8" height="36" fill="#a8a8a8" fill-opacity="0.75" />
			<rect x="24" y="0" width="8" height="36" fill="#ffffff" fill-opacity="0.75" />
		</svg>
	</div>
	<span class="font-sans-alt text-2xs sm:text-sm">Four land uses</span>
</div>
<hr class="border-earth border-opacity-25" />
<div class="stack-h stack-h-xs items-center">
	<div
		class="bg-secondary border-secondary relative h-4 w-4 border-[3px] bg-opacity-10 sm:h-5 sm:w-5"
	>
		<div
			class="border-secondary absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform border sm:h-3 sm:w-3"
		/>
	</div>
	<span class="font-sans-alt text-xs sm:text-sm">Reservation</span>
</div>

<style lang="postcss">
	.dual-pattern {
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAC20lEQVRYhcWW30tTYRjHvzsHElKGvy5km4s5oXnOlpaiifM4rf4DCTMqvIguKn+VIXTzQgaFv8uCbvohIWISRFFb2k05j0cnBKUzc5sWedkCu5XT3eDsne8ZSGfv5fd9ny8f3ud9n+cxeY9XqEhaktSE23cHk2VMT01gdLif0pNXSUkpHo9Pguf5hLa7u4tb5CY+zAY0Z3m7rYgkG2xtxXAwOxtuT7lGF0QP8gsKIQc/MQHi8d/Y3IyiwXcCHMcBADiOg+Rrwvb2L0Q2vrMBAGBJkVNCuMqEtCA2Y1EKwmQyoV7yaSD2BDAKgglgBATf1dVJwqtfmSZLigyz2QxB9FAQZrMZysK8LsTPH1uob2jUQHjrG8D7AzOkvOIY/O/eME2Uhfl9PcxYNJLyYfKEEGKxWOEpP4qADsSSIiMnJwei+4hGd5UJyM3Nw4I8x4xPdRM8IYQAgNVqgyh68D7wlmmyuEc6ygR3WumIRSMaiAQAANiK7TA6HSZVValKqMhBXO++wjQBgI6uHjSfbqX0dCumo8QJ/tTJJmK3H9JsGHUTf+Jx8Ovhz+SwS0AyhMViTQtiv3WCt9uKyOyMH5mCSFTCTEFoSnEmIKheYDREymZkJMSe3dAoCGY7NgJCdx743xB8X18fWQ4tMk1mZ/wQRQ9sxXYKIp0GxponTKqqqrFYBOdbm5kmAHCnfxR1XonSl0OL6Lx6STf+cns3Ws6c02gcADgcTjx9/kLXoLenA/I8/Zcrq6oxOPJQN/7BvSFMT03QAADgdJbiybNJXZMb19qhyEFKr66pxcDQmG786HC/BoJqx0anI+U8sLH+DW0XWnRNBobGUFNbR+npzhNeyQdTOLyiulwCtWnUTXAX285ibW2V2nA4nBifmNY16O3pQHDuI6VXVlVj5P4jfQAAyCRE4hdkCkJTil+/eglJakR+QaHmUF5ePrIOZCEUUpgQrIr5d2cHqytfqJh/s7DSONlyQNkAAAAASUVORK5CYII=);
	}
</style>
