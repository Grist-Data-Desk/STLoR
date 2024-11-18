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
	export let collapsed = false;

	const dispatch = createEventDispatcher();

	function onClickTab(i: number): () => void {
		return function setActiveTab(): void {
			activeIndex = i;
			dispatch('change', { index: i });
		};
	}

	function onCollapse() {
		collapsed = !collapsed;
	}
</script>

<div class="stack stack-sm">
	<div class="stack-h stack-h-md border-b-earth border-b border-opacity-25">
		<ul class="stack-h stack-h-md flex-1">
			{#each tabs as tab, i}
				<li
					class="font-sans-alt text-earth border-b-2 pb-2 text-sm transition-colors duration-200"
					class:active={activeIndex === i}
					class:inactive={activeIndex !== i}
				>
					<button on:click={onClickTab(i)}>{tab.name}</button>
				</li>
			{/each}
		</ul>
		<button class="sm:hidden" on:click={onCollapse}>
			<svg
				height="16"
				width="16"
				stroke-linejoin="round"
				viewBox="0 0 16 16"
				style="color: currentcolor;"
				class="transform transition-transform duration-300"
				class:rotate-180={collapsed}
				><path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
					fill="currentColor"
				></path></svg
			></button
		>
	</div>
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
