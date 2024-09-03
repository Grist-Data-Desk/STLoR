/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				earth: '#3c3830',
				smog: '#f0f0f0',
				primary: '#ec6c37',
				secondary: '#476039'
			},
			fontFamily: {
				sans: '"PolySans", "Open Sans", Helvetica, sans-serif',
				'sans-alt': "Basis Grotesque Pro, 'Open Sans', Helvetica, sans-serif",
				serif: '"GT Super Display", Georgia, serif'
			},
			fontSize: {
				'2xs': ['0.6875rem', '1rem']
			}
		}
	},
	important: '#stlor-map-root',
	plugins: []
};
