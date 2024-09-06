<script lang="ts">
	import { LAND_USE_TO_COLORS } from '$lib/utils/constants';
</script>

{#each Object.entries(LAND_USE_TO_COLORS) as [landUse, color]}
	<div class="stack-h stack-h-xs items-center">
		<div
			class="h-3 w-3 border bg-opacity-75 sm:h-5 sm:w-5"
			style="background-color: {color}; border-color: {color};"
		/>
		<span class="font-sans-alt text-2xs sm:text-sm">{landUse}</span>
	</div>
{/each}
