/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        service: '2px 2px 3px 3px rgba(0, 0, 0, 0.3)'
      },
      fontFamily: {
        yeseva: ['Yeseva One', 'cursive'],
        work: ['Work Sans', 'sans-serif']
      },
      colors: {
        primary: '#1F2B6C',
        secondary: '#159EEC',
        accent: '#BFD2F8'
      },
      backgroundImage: {
        hero: "url('/public/image_assets/hero-bg.JPG')",
        'hero-mobile': "url('/public/image_assets/hero-bg-mobile.png')",
        'about-quote': "url('/public/image_assets/quoteBG.jpg')",
        appointment: "url('/public/image_assets/appointment.png')",
        'doctor-card': "url('/public/image_assets/DoctorCardImg.jpg')"
      }
    }
  },
  plugins: []
}
