<script context="module" lang="ts">
	export interface Tab<Props = Record<string, unknown>> {
		name: string;
		content: ComponentType;
		props?: Props;
	}
</script>

<script lang="ts">
	import { type ComponentType, createEventDispatcher } from 'svelte';

	import ReservationHeader from '$lib/components/menu/ReservationHeader.svelte';

	export let tabs: Tab[] = [];
	export let activeIndex = 0;

	const dispatch = createEventDispatcher();

	function onClickTab(i: number): () => void {
		return function setActiveTab(): void {
			activeIndex = i;
			dispatch('change', { index: i });
		};
	}
</script>

<div class="stack stack-sm">
	<ul class="stack-h stack-h-md border-b-earth border-b border-opacity-25">
		{#each tabs as tab, i}
			<li
				class="font-sans-alt text-earth border-b-2 pb-2 text-sm transition-all duration-200"
				class:active={activeIndex === i}
				class:inactive={activeIndex !== i}
			>
				<button on:click={onClickTab(i)}>{tab.name}</button>
			</li>
		{/each}
	</ul>
	{#each tabs as tab, i}
		{#if activeIndex === i}
			<div class="stack stack-xs">
				<ReservationHeader />
				<div class="stack stack-xs">
					<svelte:component this={tab.content} {...tab.props} />
				</div>
			</div>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.active {
		@apply border-b-earth font-semibold;
	}

	.inactive {
		@apply border-b-transparent font-light;
	}
</style>
