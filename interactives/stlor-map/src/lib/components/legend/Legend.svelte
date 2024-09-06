<script lang="ts">
	import AcreageLegend from '$lib/components/legend/AcreageLegend.svelte';
	import LandUseLegend from '$lib/components/legend/LandUseLegend.svelte';
	import RightsTypeLegend from '$lib/components/legend/RightsTypeLegend.svelte';
	import { legendOpen } from '$lib/stores/legend';
	import { view } from '$lib/stores/view';

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />
<div
	class="border-earth bg-smog/75 absolute right-14 top-14 grid grid-cols-2 gap-1 rounded border p-2 shadow-xl backdrop-blur sm:left-auto sm:right-8 sm:top-8 sm:gap-2"
	class:hidden={innerWidth <= 640 ? !$legendOpen : false}
	class:grid-cols-2={$view === 'Acreage' || $view === 'Rights type'}
	class:grid-cols-3={$view === 'Land use'}
>
	{#if $view === 'Acreage'}
		<AcreageLegend />
	{:else if $view === 'Land use'}
		<LandUseLegend />
	{:else if $view === 'Rights type'}
		<RightsTypeLegend />
	{/if}
</div>
