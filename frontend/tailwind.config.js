/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      colors: {
        background: '#09090b', // Fond très sombre
        surface: '#18181b',    // Carte
        border: '#27272a',     // Bordure subtile
        
        // Accents
        primary: '#3b82f6',    // OpenDefender Blue
        
        // Semantic Risks
        risk: {
          low: '#10b981',      // Emerald
          medium: '#f59e0b',   // Amber
          high: '#f97316',     // Orange
          critical: '#ef4444', // Red
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}