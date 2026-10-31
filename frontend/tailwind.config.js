/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          navy: {
            950: '#070C1A',
            900: '#0A1128',
            800: '#101935',
            700: '#18254A',
            600: '#233566',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F5E6BE',
            dark: '#AA820A',
            accent: '#C5A059',
          },
          cream: {
            50: '#FDFBF7',
            100: '#FAF7F2',
            200: '#F5EFEB',
            300: '#EAE1D5',
            400: '#DDD0C0',
          },
          terracotta: {
            DEFAULT: '#C85A32',
            dark: '#9E3F1D',
          }
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA820A 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0A1128 0%, #101935 100%)',
        'parchment-pattern': 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
