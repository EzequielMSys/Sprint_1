/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#22C55E',
        accent: '#F59E0B',
        bgDark: '#0F172A',
        bgCard: '#1E293B',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}

