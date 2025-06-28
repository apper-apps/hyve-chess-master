/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        'chess-dark': '#8B4513',
        'chess-light': '#D2691E',
        'chess-accent': '#FFD700',
        'chess-surface': '#F5DEB3',
        'chess-bg': '#FFF8DC',
        'chess-success': '#228B22',
        'chess-warning': '#FF8C00',
        'chess-error': '#DC143C',
        'chess-info': '#4682B4',
        'drag-preview': '#FFD700',
        'drop-zone': '#90EE90',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'wood-grain': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXRlcm4gaWQ9IndvZDItZ3JhaW4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgICAgIDxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzBhMGEwYSIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+CiAgICAgIDxwYXRoIGQ9Im0wIDMwIDMwLTMwIDMwIDMwLTMwIDMweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd29vZDItZ3JhaW4pIi8+Cjwvc3ZnPg==')",
      },
      spacing: {
        'square-xs': '2.5rem',
        'square-sm': '3rem',
        'square-md': '3.5rem',
        'square-lg': '4rem',
        'board-xs': '20rem',
        'board-sm': '24rem',
        'board-md': '28rem',
        'board-lg': '32rem',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.3s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'drag-enter': 'drag-enter 0.2s ease-in-out',
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