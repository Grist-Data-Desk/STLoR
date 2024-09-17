/**
 * Capitalizes the first letter of a string.
 *
 * @param input – The string to capitalize.
 * @returns – The input string with the first letter capitalized.
 */
export function capitalize(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1);
}
