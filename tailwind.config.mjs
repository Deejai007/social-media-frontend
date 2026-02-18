/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{mjs,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      height: {
        120: "30rem",
        192: "",
      },
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
        primary: "rgba(99 ,102, 2241,0.7)",
        // primary: "#3F51B5",
        secondary: "#159EEC",
        accent: "#BFD2F8",
        mainbg: "rgb(240, 245, 245)",
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
        "2md": "884px",
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
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      opacity: {
        10: "0.1",
        90: "0.9",
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
};
