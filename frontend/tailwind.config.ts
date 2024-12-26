import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          from: { scale: "0", opacity: "0" },
          to: { scale: "1", opacity: "1" },
        },
      },
      animation: {
        appear: "appear linear",
      },
      backgroundImage: {
        purpleGradient:
          "linear-gradient(96.44deg, #c5d5ff, #e2f0ff 51.56%, #d7d4ff)",
        nightSkyRadial:
          "radial-gradient(ellipse at bottom, #394757 0%, #090a0f 100%)",
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true })],
} satisfies Config;
