/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          green: '#00FF00',
          darkGreen: '#004400',
          black: '#000000',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'mobile-xs': '0.65rem',
        'mobile-sm': '0.75rem',
        'mobile-base': '0.875rem',
        'mobile-lg': '1rem',
      },
      spacing: {
        'mobile-1': '0.25rem',
        'mobile-2': '0.5rem',
        'mobile-3': '0.75rem',
        'mobile-4': '1rem',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'hyperspace-jump': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(2)', opacity: 0.5 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'star-wars-scroll': {
          '0%': { 
            transform: 'perspective(1000px) rotateX(90deg) translateY(-100%)',
            opacity: 0 
          },
          '100%': { 
            transform: 'perspective(1000px) rotateX(0deg) translateY(0)',
            opacity: 1 
          },
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'hyperspace-jump': 'hyperspace-jump 0.5s ease-in-out',
        'star-wars-scroll': 'star-wars-scroll 2s ease-out forwards',
      },
    },
  },
  plugins: [],
};