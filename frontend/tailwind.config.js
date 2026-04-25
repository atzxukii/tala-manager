/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: { // Garde le nom de classe mais utilise le vert olive du logo
          darker: '#262E20',
          dark:   '#384031',
          DEFAULT:'#4A5243',
          medium: '#636C5B',
          light:  '#808A77',
          pale:   '#A3AD9A',
        },
        cream: {
          dark:   '#EDE8C8',
          DEFAULT:'#F5F5DC',
          light:  '#FAFAF0',
        },
        alert: {
          low:    '#FFF8E1',
          lowBorder: '#F59E0B',
          out:    '#FEF2F2',
          outBorder: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft:  '0 2px 12px rgba(111, 78, 55, 0.10)',
        card:  '0 4px 24px rgba(111, 78, 55, 0.12)',
        hover: '0 8px 30px rgba(111, 78, 55, 0.18)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.5rem',
      },
    },
  },
  plugins: [],
}
