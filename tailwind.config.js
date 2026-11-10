/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#E9E7FF',
        background: '#F7F8FC',
        text: '#202333',
        success: '#22C55E',
        danger: '#EF4444',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(108, 99, 255, 0.12)',
      },
    },
  },
  plugins: [daisyui],
};
