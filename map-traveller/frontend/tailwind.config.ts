import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b8b8b',
          light: '#a0a0a0',
          dark: '#6b6b6b',
        },
        secondary: {
          DEFAULT: '#7f7f7f',
          light: '#9e9e9e',
          dark: '#5d5d5d',
        },
        travel: {
          DEFAULT: '#888888',
          light: '#a8a8a8',
          dark: '#686868',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
    },
  },
  plugins: [],
}
export default config
