/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta editorial: verde oliva profundo + crema + acentos
        cream: {
          50: '#FBF9F4',
          100: '#F5F1E8',
          200: '#EAE3D2',
        },
        moss: {
          50: '#EFF1EC',
          100: '#D6DCCF',
          200: '#A9B69C',
          300: '#7C8E6B',
          400: '#566849',
          500: '#3A4A30',
          600: '#2A3622',
          700: '#1E2818',
          800: '#161D11',
        },
        clay: {
          100: '#F4E4D6',
          200: '#E5C4A7',
          300: '#C99973',
          400: '#A87149',
          500: '#8B5A3C',
        },
        ink: {
          900: '#1A1A1A',
          800: '#2B2B2B',
          700: '#404040',
          500: '#737373',
          400: '#A3A3A3',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(26, 29, 17, 0.04), 0 4px 12px rgba(26, 29, 17, 0.04)',
        'card-hover': '0 2px 4px rgba(26, 29, 17, 0.06), 0 8px 24px rgba(26, 29, 17, 0.08)',
        'inner-soft': 'inset 0 1px 2px rgba(26, 29, 17, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
