const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    {
      pattern: /grid-cols-./,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3C33FF',
        secondary: '#140ABA',
        tertiary: '#008F0E',
        black: '#000000',
        dark: '#323239',
        warning: '#E1980A',
        danger: '#DB3500',
        error: '#DD2A03',
        success: '#49C462',
        disabled: '#D2D8EA',
        'gris-oscuro': '#666666',
        'dark-gray': '#5A5A67',
        'light-gray': '#8B92A9',
        'ultra-light-gray': '#F0F0F2',
        'ultra-light-salmon': '#fceaed',
        'ultra-light-blue': '#EFF3FF',
        'dark-semi-transparent': 'rgba(50, 50, 57, 0.7)',
        divider: '#E5E8F0',
      },
      borderRadius: {
        '4xl': '30px',
        '5xl': '40px',
      },
      fontFamily: {
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
        title: ['Quicksand', ...defaultTheme.fontFamily.sans],
        'family-2': ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '3xl-plus': '2.375rem',
        '2xl-plus': '1.625rem',
        'xl-plus': '1.375rem',
      },
      minHeight: {
        'button-lg': '52px',
        'button-md': '44px',
        'button-sm': '22px',
      },
      spacing: {
        content: '1rem',
        4.5: '1.125rem',
        desktop: '60rem',
      },
      dropShadow: {
        donde: '0 8px 16px rgba(0, 0, 0, 0.04)',
      },
      boxShadow: {
        '3xl': '0px 4px 25px 0px #0000001A',
        '4xl': '0px 8px 16px 0px #0000000A',
        main: '0px 2px 25px 0px #00000014',
      },
      minWidth: {
        desktop: '60rem',
      },
      maxWidth: {
        desktop: '60rem',
      },
      backgroundImage: {
        'main-image': "url('../assets/img/main-bg.png')",
      },
      backgroundColor: {
        disabled: '#CCCCCC',
        'tag-secondary': '#3C33FF1A',
        'tag-tertiary': '#00BF121A',
        'tag-quaternary': '#6666660D',
      },
    },
  },
  mode: 'jit',
  plugins: [],
};
