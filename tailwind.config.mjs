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
        nunito: ["Nunito Sans", "sans-serif"],
      },
      colors: {
        primary: "#1F2B6C",
        secondary: "#159EEC",
        accent: "#BFD2F8",
      },
      backgroundImage: {
        hero: "url('/public/image_assets/hero-bg.JPG')",
        "hero-mobile": "url('/public/image_assets/hero-bg-mobile.png')",
        "about-quote": "url('/public/image_assets/quoteBG.jpg')",
        appointment: "url('/public/image_assets/appointment.png')",
        "doctor-card": "url('/public/image_assets/DoctorCardImg.jpg')",
      },
      screens: {
        xs: "480px", // Extra small devices
        sm: "640px", // Small devices (landscape phones, 576px and up)
        md: "768px", // Medium devices (tablets, 768px and up)
        lg: "1024px", // Large devices (desktops, 992px and up)
        xl: "1280px", // Extra large devices (large desktops, 1200px and up)
        "2xl": "1536px", // Larger desktops (1440px and up)
        "3xl": "1600px", // Custom larger desktops
        "4xl": "1920px", // Full HD desktops and higher
        "5xl": "2560px", // Ultra-wide screens
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
