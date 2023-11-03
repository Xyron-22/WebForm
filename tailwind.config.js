/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'petron': "url('./../public/background/petron.jpg')"
     },
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      "whiteSmoke": "#f5f5f5",
      "black": "#000000",
      "white": "#FFFFFF",
      "lightBlue": "#ADD8E6",
      "lightGreen": "#90EE90",
      "gray": "#808080",
      "blue": "#00008B",
      "red": "#FF0000"
    }
  },
  plugins: [],
}
