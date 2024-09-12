<script lang="ts">
	import { getContext } from 'svelte';

	import { reservation } from '$lib/stores/reservation';
	import type { Data } from '$lib/types';

	const data = getContext<Data>('data');
	const options = Object.values(data.reservationStats).map(({ reservation_name }) => ({
		value: reservation_name,
		label: reservation_name
	}));

	async function onChange(event: Event) {
		const target = event.target as HTMLSelectElement;

		reservation.set(target.value);
	}
</script>

<select
	class="font-sans-alt truncate bg-transparent text-sm sm:text-base"
	on:change={onChange}
	value={$reservation}
>
	{#each options as { value, label }}
		<option {value}>{label}</option>
	{/each}
</select>
