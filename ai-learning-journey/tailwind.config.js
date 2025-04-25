/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5',    // indigo-600
          light: '#818cf8',   // indigo-400
        },
        secondary: {
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#7c3aed',    // violet-600
          light: '#a78bfa',   // violet-400
        },
        success: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',    // emerald-600
          light: '#34d399',   // emerald-400
        },
        warning: {
          DEFAULT: '#f59e0b', // amber-500
          dark: '#d97706',    // amber-600
          light: '#fbbf24',   // amber-400
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
          dark: '#dc2626',    // red-600
          light: '#f87171',   // red-400
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 20px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
} 