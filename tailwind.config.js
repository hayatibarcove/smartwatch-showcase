/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E0E",
        foreground: "#FFFFFF",
        "primary-gold": "#D4AF37",
        "secondary-charcoal": "#2E2E2E",
        "text-secondary": "#AAAAAA",
        "gold-hover": "#FFD700",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gold-pulse": "gold-pulse 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "orbit-progress": "orbit-progress 2s linear infinite",
        "marker-pulse": "marker-pulse 1.5s ease-in-out infinite",
        "gold-shimmer": "gold-shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0.9)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px #D4AF37" },
          "50%": { boxShadow: "0 0 20px #D4AF37, 0 0 30px #D4AF37" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px #D4AF37" },
          "50%": { boxShadow: "0 0 25px #D4AF37, 0 0 40px #D4AF37" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "orbit-progress": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "marker-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
