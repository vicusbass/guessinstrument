/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,mdx,md}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        success: '#7CFF6B',
        warning: '#FFB347',
        error: '#FF6B6B',
        background: '#F7F9FC',
        text: '#333333',
        'text-light': '#666666'
      }
    },
  },
  plugins: [],
}
