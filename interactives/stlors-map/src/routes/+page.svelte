<script lang="ts">
	import { setContext } from 'svelte';

	import Map from '$lib/components/Map.svelte';

	export let data;

	setContext('data', data);
</script>

<Map />
