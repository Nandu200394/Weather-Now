// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         skyPrimary: "#a0c9f7",
//         sand: "#f3e9cf",
//         glassBorder: "rgba(255,255,255,0.18)"
//       }
//     }
//   },
//   plugins: []
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "wn-blue": "#08324a",
        "wn-muted": "#4b5563",
      },
      borderRadius: {
        "xl-2": "14px",
      },
    },
  },
  plugins: [],
};
