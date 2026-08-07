import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a1628',
        secondary: '#1e3a5f',
        accent: '#e63946',
        'accent-hover': '#c1121f',
        gold: '#c9a227',
        'coast-blue': '#0066cc',
        'coast-teal': '#00a8a8',
        'text-main': '#2d3748',
        'text-light': '#718096',
        'border-light': '#e2e8f0',
        success: '#10b981',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        'site': '1400px',
      },
    },
  },
  plugins: [],
};

export default config;
