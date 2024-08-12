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
      },
      colors:{
        brown:{
          700: '#4E3B2F'
        },
        primary: '#000000',
        purpleAccent: '#5b3dcc',
        shade1: '#171717',
        shade2: '#2c2c2e',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
    fontFamily: {
      'montserrat': ['Montserrat', 'sans-serif'],
      'oswald': ['Oswald', 'sans-serif'], 
    }
  },
  variants: {
    extend: {
      translate: ['group-hover'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
