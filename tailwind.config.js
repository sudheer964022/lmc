/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e40af', // Rich blue for glows
          600: '#1e3a8a', // Premium deep navy for headers/buttons
          700: '#172554', // Darker for hover states
          800: '#0b1633',
          900: '#050b1a',
          950: '#03050d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan': {
          '0%': { top: '0', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'dash': {
          'to': { strokeDashoffset: '-1000' }
        },
        'drive': {
          '0%': { transform: 'translate(-50%, -50%)' },
          '100%': { transform: 'translate(100%, 80%)' }
        },
        'map-tilt': {
          '0%': { transform: 'scale(1.2) rotateX(0deg) translateY(-24px)', transformOrigin: 'bottom center' },
          '100%': { transform: 'scale(1.5) rotateX(45deg) translateY(0)', transformOrigin: 'bottom center' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scan': 'scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'dash': 'dash 20s linear infinite',
        'drive': 'drive 10s ease-in-out infinite',
        'map-tilt': 'map-tilt 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}
