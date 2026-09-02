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
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};