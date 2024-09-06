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
					class="font-sans-alt text-earth border-b-2 pb-2 text-sm transition-all duration-200"
					class:active={activeIndex === i}
					class:inactive={activeIndex !== i}
				>
					<button on:click={onClickTab(i)}>{tab.name}</button>
				</li>
			{/each}
		</ul>
		<button class="sm:hidden" on:click={onCollapse}>
			{#if collapsed}
				<svg
					height="16"
					stroke-linejoin="round"
					viewBox="0 0 16 16"
					width="16"
					style="color: currentcolor;"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
						fill="currentColor"
					></path></svg
				>
			{:else}
				<svg
					height="16"
					stroke-linejoin="round"
					viewBox="0 0 16 16"
					width="16"
					style="color: currentcolor;"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
						fill="currentColor"
					></path></svg
				>
			{/if}</button
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
