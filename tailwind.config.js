/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Using standard Tailwind colors including orange-500 for the brand
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        aspire: {
          "primary": "#f97316", // Orange-500
          "primary-content": "#ffffff",
          "secondary": "#a855f7", // Purple-500
          "secondary-content": "#ffffff",
          "accent": "#3b82f6", // Blue-500
          "accent-content": "#ffffff",
          "neutral": "#374151", // Gray-700
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb", // Gray-50
          "base-300": "#e5e7eb", // Gray-200
          "base-content": "#111827", // Gray-900
          "info": "#3b82f6",
          "success": "#10b981", // Green-500
          "warning": "#f59e0b", // Yellow-500
          "error": "#ef4444", // Red-500
        },
      },
      "light",
      "dark",
      "corporate"
    ],
  },
}
