/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta real del proyecto
        fondo: '#0d0a16',
        primario: '#7d63e6',
        texto: '#eae6ff',
        // Dark Purple Premium (compatibilidad)
        'dark-purple': {
          '900': '#0d0a16', // Fondo principal
          '800': '#1a1526', // Superficies/Cards
          '700': '#261f37', // Hover states
        },
        'purple': {
          'electric': '#7d63e6', // Primario
          'electric-hover': '#6f55d8',
        },
        'accent': {
          'pink': '#f472b6',
          'blue': '#8b7cff',
          'orange': '#fb923c',
          'cyan': '#67e8f9',
        },
        'text': {
          'primary': '#eae6ff', // Texto principal
          'secondary': '#e4ddff',
          'muted': '#b1a6da',
        },
      },
      textColor: {
        'text': {
          'primary': '#eae6ff',
          'secondary': '#e4ddff',
          'muted': '#b1a6da',
        },
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
