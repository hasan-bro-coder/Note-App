/** @type {import('tailwindcss').Config} */
export default {
	corePlugins: {
		preflight: false,
	},
	content: [
		// './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
		"./src/components/sign-in.vue"
	],
	theme: {
		extend: {},
	},
	plugins: [],
}
