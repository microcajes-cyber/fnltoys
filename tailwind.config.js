/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background:  { DEFAULT: 'var(--background)' },
        foreground:  { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border:  { DEFAULT: 'var(--border)' },
        input:   { DEFAULT: 'var(--input)' },
        ring:    { DEFAULT: 'var(--ring)' },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm:  'calc(var(--radius) - 2px)',
        md:  'var(--radius)',
        lg:  'calc(var(--radius) + 4px)',
        xl:  'calc(var(--radius) + 8px)',
        '2xl': 'calc(var(--radius) + 16px)',
        '3xl': 'calc(var(--radius) + 24px)',
      },
      fontFamily: {
        sans:    ['var(--font-montserrat)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'float':     'float 5s ease-in-out infinite',
        'pulse-soft':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':   'fade-in 0.6s ease-out forwards',
        'scale-in':  'scale-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up':  'slide-up 0.6s ease-out forwards',
        'glow':      'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%, 100%': { 'box-shadow': '0 0 5px rgba(0, 127, 255, 0.3)' },
          '50%': { 'box-shadow': '0 0 20px rgba(0, 127, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};