/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Define the paths to all template files
  theme: {
    extend: {
      animation: {
        blink: 'blink 1s step-end infinite', // Custom animation for blinking cursor
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
