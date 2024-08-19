export function createHatchPattern(
	baseColor: string,
	stripeColor: string,
	size = 20,
	lineWidth = 6
): ImageData {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return new ImageData(0, 0);
	}

	// Fill background with baseColor.
	ctx.fillStyle = baseColor;
	ctx.fillRect(0, 0, size, size);

	// Draw diagonal lines with stripeColor.
	ctx.strokeStyle = stripeColor;
	ctx.lineWidth = lineWidth;

	// First diagonal line.
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(size, size);
	ctx.stroke();

	return ctx.getImageData(0, 0, size, size);
}
