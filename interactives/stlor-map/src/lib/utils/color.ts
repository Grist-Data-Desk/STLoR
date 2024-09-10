export function opacifyHex(hex: string, opacity: number): string {
	return `${hex}${Math.round(opacity * 255)
		.toString(16)
		.padStart(2, '0')}`;
}
