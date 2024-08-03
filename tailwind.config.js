/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        'xs':{'max' : '450px'},
      }
    },
    fontFamily: {
      'montserrat': ['Montserrat', 'sans-serif'],
      'oswald': ['Oswald', 'sans-serif'], 
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
