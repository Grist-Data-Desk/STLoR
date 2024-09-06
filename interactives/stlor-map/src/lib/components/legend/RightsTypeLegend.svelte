<script lang="ts">
	import { RIGHTS_TYPE_TO_COLORS } from '$lib/utils/constants';
</script>

<div class="stack-h stack-h-xs items-center">
	<div
		class="h-4 w-4 border bg-opacity-75 sm:h-5 sm:w-5"
		style="background-color: {RIGHTS_TYPE_TO_COLORS.surface}"
	/>
	<span class="font-sans-alt text-xs sm:text-sm">Surface</span>
</div>
<div class="stack-h stack-h-xs items-center">
	<div
		class="h-4 w-4 border bg-opacity-75 sm:h-5 sm:w-5"
		style="background-color: {RIGHTS_TYPE_TO_COLORS.subsurface}"
	/>
	<span class="font-sans-alt text-xs sm:text-sm">Subsurface</span>
</div>
