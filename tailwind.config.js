/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chess: {
          light: '#f0d9b5',
          dark: '#b58863',
          highlight: '#ffff00',
          validMove: '#90EE90',
          captureMove: '#FF6347',
          check: '#FF0000',
        },
        primary: {
          50: '#fefdf8',
          100: '#fefcf0',
          200: '#fcf7de',
          300: '#f9f0c4',
          400: '#f5e6a3',
          500: '#f0d478',
          600: '#e6c454',
          700: '#d4af37',
          800: '#b8941f',
          900: '#9a7b1a',
          950: '#5a450b',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'wood-grain': 'linear-gradient(45deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%), linear-gradient(-45deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%)',
        'wood-grain-light': 'linear-gradient(45deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%), linear-gradient(-45deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%)',
        'wood-grain-dark': 'linear-gradient(45deg, rgba(101, 67, 33, 0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(101, 67, 33, 0.05) 25%, transparent 25%)',
      },
},
      animation: {
        'bounce-subtle': 'bounce-subtle 0.6s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'drag-enter': 'drag-enter 0.2s ease-out',
        'piece-hover': 'piece-hover 0.3s ease-in-out',
        'drop-hint': 'drop-hint 1s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'drag-enter': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' },
          '100%': { transform: 'scale(1.05)', boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.3)' },
        },
        'piece-hover': {
          '0%': { transform: 'scale(1) translateY(0)' },
          '100%': { transform: 'scale(1.1) translateY(-2px)' },
        },
        'drop-hint': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}