module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        {
            pattern: /^splide__(pagination|arrow|track|list|slide)/,
        },
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Manrope", "sans-serif"],
            },
            colors: {
                primary: "#1a1a1a",
                secondary: "#FFB800",
                accent: "#F3F4F6",
            },
        },
    },
    plugins: [],
}
