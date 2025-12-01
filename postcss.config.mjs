/* eslint-disable @typescript-eslint/no-require-imports */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      plugins: [require("@tailwindcss/typography")],
    },
  },
};

export default config;
