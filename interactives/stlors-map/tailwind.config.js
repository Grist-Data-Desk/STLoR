/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				earth: '#3c3830',
				orange: '#ec6c37',
				teal: '#476039'
			},
			fontFamily: {
				sans: '"PolySans", "Open Sans", Helvetica, sans-serif',
				'sans-alt': "Basis Grotesque Pro, 'Open Sans', Helvetica, sans-serif",
				serif: '"GT Super Display", Georgia, serif'
			}
		}
	},
	plugins: []
};
