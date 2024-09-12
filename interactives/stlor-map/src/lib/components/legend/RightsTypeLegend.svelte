<script lang="ts">
	import { opacifyHex } from '$lib/utils/color';
	import { RIGHTS_TYPE_TO_COLORS } from '$lib/utils/constants';
</script>

<h2>Rights type</h2>
<div class="stack-h stack-h-xs items-center">
	<div
		class="h-4 w-4 border sm:h-5 sm:w-5"
		style="background-color: {opacifyHex(
			RIGHTS_TYPE_TO_COLORS.surface,
			0.75
		)}; border-color: {opacifyHex(RIGHTS_TYPE_TO_COLORS.surface, 0.75)};"
	/>
	<span class="font-sans-alt text-xs sm:text-sm">Surface</span>
</div>
<div class="stack-h stack-h-xs items-center">
	<div
		class=" h-4 w-4 border sm:h-5 sm:w-5"
		style="background-color: {opacifyHex(
			RIGHTS_TYPE_TO_COLORS.subsurface,
			0.75
		)}; border-color: {opacifyHex(RIGHTS_TYPE_TO_COLORS.subsurface, 0.75)};"
	/>
	<span class="font-sans-alt text-xs sm:text-sm">Subsurface</span>
</div>
<div class="stack-h stack-h-xs items-center">
	<div class="h-4 w-4 sm:h-5 sm:w-5">
		<svg viewBox="0 0 32 32" width="32" height="32" class="h-auto max-w-full">
			<path d="M0,24 L8,32 L0,32 z" fill={RIGHTS_TYPE_TO_COLORS.surface} fill-opacity="0.75" />
			<path
				d="M0,16 L16,32 L8,32, L0,24 z"
				fill={RIGHTS_TYPE_TO_COLORS.subsurface}
				fill-opacity="0.75"
			/>
			<path
				d="M0,8 L24,32 L16,32, L0,16 z"
				fill={RIGHTS_TYPE_TO_COLORS.surface}
				fill-opacity="0.75"
			/>
			<path
				d="M0,0 L32,32 L24,32, L0,8 z"
				fill={RIGHTS_TYPE_TO_COLORS.subsurface}
				fill-opacity="0.75"
			/>
			<path
				d="M8,0 L32,24 L32,32, L0,0 z"
				fill={RIGHTS_TYPE_TO_COLORS.surface}
				fill-opacity="0.75"
			/>
			<path
				d="M16,0 L32,16 L32,24 L8,0 z"
				fill={RIGHTS_TYPE_TO_COLORS.subsurface}
				fill-opacity="0.75"
			/>
			<path
				d="M24,0 L32,8 L32,16, L16,0 z"
				fill={RIGHTS_TYPE_TO_COLORS.surface}
				fill-opacity="0.75"
			/>
			<path d="M24,0 L32,0 L32,8 z" fill={RIGHTS_TYPE_TO_COLORS.subsurface} fill-opacity="0.75" />
		</svg>
	</div>
	<span class="font-sans-alt text-xs sm:text-sm">Surface and Subsurface</span>
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
