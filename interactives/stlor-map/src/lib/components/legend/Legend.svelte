<script lang="ts">
	import AcreageLegend from '$lib/components/legend/AcreageLegend.svelte';
	import LandUseLegend from '$lib/components/legend/LandUseLegend.svelte';
	import RightsTypeLegend from '$lib/components/legend/RightsTypeLegend.svelte';
	import { legendOpen } from '$lib/stores/legend';
	import { view } from '$lib/stores/view';
	import { TABLET_BREAKPOINT } from '$lib/utils/constants';

	let innerWidth: number;
	$: isTabletOrAbove = innerWidth > TABLET_BREAKPOINT;
</script>

<svelte:window bind:innerWidth />
<div
	class="border-earth bg-smog/75 stack-xs stack absolute right-14 top-14 rounded border p-2 shadow-xl backdrop-blur sm:left-auto sm:right-8 sm:top-8"
	class:!hidden={isTabletOrAbove ? false : !$legendOpen}
	style="max-width: calc(94% - 3rem);"
>
	{#if $view === 'Acreage'}
		<AcreageLegend />
	{:else if $view === 'Land use'}
		<LandUseLegend />
	{:else if $view === 'Rights type'}
		<RightsTypeLegend />
	{/if}
</div>
