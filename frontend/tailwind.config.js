/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-light': 'var(--color-light)',
        'brand-pastel': 'var(--color-pastel)',
        'brand-primary': 'var(--color-primary)',
        'brand-dark': 'var(--color-dark)',
      },
    },
  },
  plugins: [],
}

