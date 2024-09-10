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
		<svg viewBox="0 0 36 36" width="36" height="36" class="h-auto max-w-full">
			<path d="M0,24 L12,36 L0,36, z" fill={RIGHTS_TYPE_TO_COLORS.surface} fill-opacity="0.75" />
			<path
				d="M0,12 L24,36 L12,36, L0,24 z"
				fill={RIGHTS_TYPE_TO_COLORS.subsurface}
				fill-opacity="0.75"
			/>
			<path
				d="M0,0 L36,36 L24,36, L0,12 z"
				fill={RIGHTS_TYPE_TO_COLORS.surface}
				fill-opacity="0.75"
			/>
			<path
				d="M12,0 L36,24 L36,36, 0,0 z"
				fill={RIGHTS_TYPE_TO_COLORS.subsurface}
				fill-opacity="0.75"
			/>
			<path
				d="M24,0 L36,12 L36,24, L12,0 z"
				fill={RIGHTS_TYPE_TO_COLORS.surface}
				fill-opacity="0.75"
			/>
			<path d="M24,0 L36,0 L36,12 z" fill={RIGHTS_TYPE_TO_COLORS.subsurface} fill-opacity="0.75" />
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
