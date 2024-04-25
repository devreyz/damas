/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" }
        },
        swipUp: {
          "0%": {
            transform: "translateY(200px) scale(1.1)",
            opacity: "0.3"
          },
          "100%": {
            transform: "translateY(0px) scale(1)",
            opacity: "1"
          }
        },
        swipRight: {
          "0%": {
            transform: "translateX(0%)",
            opacity: "1"
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0"
          }
        }
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
        swipUp: "swipUp .3s ease-in",
        swipRight: "swipRight .3s ease-out"
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
