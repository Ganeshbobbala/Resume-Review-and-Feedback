/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        slate: {
          850: '#131c2e',
          950: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 10s infinite',
        'blob-reverse': 'blob-reverse 12s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'scan-beam': 'scan-beam 2.5s ease-in-out infinite',
        'beam-sway-1': 'beam-sway-1 14s ease-in-out infinite',
        'beam-sway-2': 'beam-sway-2 18s ease-in-out infinite',
        'beam-sway-3': 'beam-sway-3 12s ease-in-out infinite',
        'flare-breathe': 'flare-breathe 6s ease-in-out infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'blob-reverse': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-30px, 40px) scale(1.15)' },
          '66%': { transform: 'translate(25px, -20px) scale(0.85)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scan-beam': {
          '0%': { top: '0%', opacity: '0' },
          '15%': { opacity: '0.85' },
          '85%': { opacity: '0.85' },
          '100%': { top: '100%', opacity: '0' },
        },
        'beam-sway-1': {
          '0%, 100%': { transform: 'rotate(-18deg) scaleX(1)' },
          '50%': { transform: 'rotate(-24deg) scaleX(1.08)' },
        },
        'beam-sway-2': {
          '0%, 100%': { transform: 'rotate(18deg) scaleX(1)' },
          '50%': { transform: 'rotate(24deg) scaleX(1.08)' },
        },
        'beam-sway-3': {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%': { transform: 'rotate(3deg) scale(1.04)' },
        },
        'flare-breathe': {
          '0%, 100%': { opacity: '0.5', transform: 'scaleX(0.95)' },
          '50%': { opacity: '0.9', transform: 'scaleX(1.05)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.98)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
      }
    },
  },
  plugins: [],
}
