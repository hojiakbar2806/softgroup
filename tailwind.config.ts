import type {Config} from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                scroll: {
                    to: {transform: "translateX(calc(-100% - var(--scroll-gap)))"},
                },
            },
            animation: {
                scroll: "scroll 20s linear infinite",
            },
            backgroundImage: {
                parallex: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
            }
        },
    },
    plugins: [],
} satisfies Config;
