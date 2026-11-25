/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#095797",
          deepBlue: "#07477D",
          darkNavy: "#052644",
          lightBlue: "#1E78C2",
          azure: "#2985D6",
          navy: "#095797",
          ocean: "#1E78C2",
          yellow: "#F4DB35",
          lime: "#CCD52E",
          seed: "#91B64C",
          cream: "#F3F0E5",
          honey: "#CF913C",
          berry: "#B52D46",
          currant: "#44204F",
          wheat: "#C68D34",
          oat: "#D0BB8C",
          cardNavy: "#07477D"
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};
