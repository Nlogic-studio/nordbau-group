module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                nord: {
                    blue: '#004c8f',
                    dark: '#1a1a1a',
                    light: '#f5f5f5',
                }
            }
        },
    },
    plugins: [],
}
