/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8edf5',
          100: '#c5d0e5',
          200: '#9fb1d2',
          300: '#7992bf',
          400: '#5c7ab1',
          500: '#3f63a3',
          600: '#2d5095',
          700: '#1B2A4A',
          800: '#152240',
          900: '#0e1a32',
          950: '#070d1a',
        },
        rosegold: {
          50: '#fdf6f0',
          100: '#faeadc',
          200: '#f4d3b7',
          300: '#E8C9B0',
          400: '#ddb48a',
          500: '#C9956A',
          600: '#b87d50',
          700: '#9a6540',
          800: '#7d5135',
          900: '#653f28',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF7F4',
          200: '#f5efe8',
          300: '#ede3d8',
          400: '#e2d3c2',
          500: '#d4bfa6',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #1B2A4A 0%, #2d3f6b 50%, #1B2A4A 100%)',
        'rose-gradient': 'linear-gradient(135deg, #C9956A 0%, #E8C9B0 100%)',
        'hero-overlay': 'linear-gradient(to right, rgba(27,42,74,0.85) 0%, rgba(27,42,74,0.4) 60%, transparent 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(27, 42, 74, 0.12)',
        'luxury-lg': '0 8px 48px rgba(27, 42, 74, 0.18)',
        'luxury-xl': '0 16px 64px rgba(27, 42, 74, 0.22)',
        'rose': '0 4px 20px rgba(201, 149, 106, 0.3)',
        'rose-lg': '0 8px 32px rgba(201, 149, 106, 0.4)',
        'card': '0 2px 16px rgba(26, 26, 46, 0.08)',
        'card-hover': '0 8px 40px rgba(26, 26, 46, 0.16)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
