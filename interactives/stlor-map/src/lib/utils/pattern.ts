/**
 * Convert a data URL to an ImageData object.
 *
 * @param dataUrl – A base64-encoded data URL.
 * @returns - A Promise containing the corresponding ImageData object.
 */
export function convertDataURLToImageData(dataUrl: string): Promise<ImageData> {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const image = new Image();

	return new Promise((resolve) => {
		image.onload = () => {
			canvas.width = image.width;
			canvas.height = image.height;
			ctx?.drawImage(image, 0, 0);
			resolve(ctx?.getImageData(0, 0, canvas.width, canvas.height) ?? new ImageData(0, 0));
		};

		image.src = dataUrl;
	});
}
