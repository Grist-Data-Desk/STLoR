import { writable } from 'svelte/store';

export const view = writable<'Acreage' | 'Land use' | 'Rights type'>('Acreage');
