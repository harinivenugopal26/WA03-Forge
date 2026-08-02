/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          card: '#151C2C',
          border: '#232D42',
          primary: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          orange: '#F97316',
          danger: '#EF4444',
          accent: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-red': 'glowRed 2s infinite alternate',
      },
      keyframes: {
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(239, 68, 68, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.9)' }
        }
      }
    },
  },
  plugins: [],
}
