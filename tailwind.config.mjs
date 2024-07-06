/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{mjs,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        service: "2px 2px 3px 3px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        yeseva: ["Yeseva One", "cursive"],
        work: ["Work Sans", "sans-serif"],
        sevillana: ["Sevillana", "cursive"],
        nunito: ["Nunito Sans", "sans-serif"],
      },
      colors: {
        primary: "rgb(99 102 2241)",
        // primary: "#3F51B5",
        secondary: "#159EEC",
        accent: "#BFD2F8",
        mainbg: "rgb(224, 224, 224)",
      },
      backgroundImage: {
        hero: "url('/public/image_assets/hero-bg.JPG')",
        "hero-mobile": "url('/public/image_assets/hero-bg-mobile.png')",
        "about-quote": "url('/public/image_assets/quoteBG.jpg')",
        appointment: "url('/public/image_assets/appointment.png')",
        "doctor-card": "url('/public/image_assets/DoctorCardImg.jpg')",
      },
      screens: {
        mob: "320px",
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2560px",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      opacity: {
        10: "0.1",
        90: "0.9",
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/line-clamp')
  ],
};
