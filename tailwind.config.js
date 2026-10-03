/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pn: {
          bg: '#FFFFFF',
          bgSecondary: '#F8FAF9',
          text: '#111827',
          heading: '#101828',
          muted: '#667085',
          green: '#00A86B',
          brightGreen: '#00D084',
          darkGreen: '#087A52',
          lightGreen: '#E8F8F1',
          border: '#E5E7EB',
          borderHover: '#00A86B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 2px 8px rgba(16, 24, 40, 0.04)',
        'clean-hover': '0 8px 24px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
}
