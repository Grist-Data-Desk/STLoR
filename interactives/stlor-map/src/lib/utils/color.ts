/**
 * Modify a hex code to include an opacity value.
 *
 * @param hex – A six-digit hex code.
 * @param opacity – An opacity value between 0 and 1.
 * @returns – An eight-digit hex code including the opacity value.
 */
export function opacifyHex(hex: string, opacity: number): string {
	return `${hex}${Math.round(opacity * 255)
		.toString(16)
		.padStart(2, '0')}`;
}
