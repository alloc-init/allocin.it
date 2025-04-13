const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#222222",
      white: "#F5F2F1",
      teal: colors.cyan,
      green: "#8c9e64",
      red: "#CF6A4C",
      purple: colors.purple,
      pink: colors.pink,
      yellow: "#E9C062",
      gray: {
        0: "#ffffff",
        100: "#e5e5e5",
        200: "#cccccc",
        300: "#b2b2b2",
        400: "#999999",
        500: "#7f7f7f",
        600: "#666666",
        700: "#4c4c4c",
        800: "#333333",
        900: "#222222",
        1000: "#000000"
      },
      blue: {
        50: "#DCEEFF",
        100: "#B4DBFF",
        200: "#85C5FE",
        300: "#4EABFE",
        400: "#2296fe",
        500: "#0084FF",
        600: "#0574e4",
        700: "#0D5DBD",
        800: "#144696",
        900: "#1D2C6C",
        1000: "#241748"
      },
      orange: {
        200: "#EB7752",
        300: "#EA6C45",
        400: "#E85C30",
        500: "#EC4815",
        600: "#DC4419",
        700: "#D04017",
        800: "#C1360F"
      }
    },
    screens: {
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1500px",
      "2xl": "1800px"
    },
    fontSize: {
      xs: ".875rem",
      sm: "1rem",
      base: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.75rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3.25rem",
      "6xl": "4rem",
      "7xl": "5rem",
      "8xl": "6rem"
    },
    borderWidth: {
      DEFAULT: "3px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px"
    },
    extend: {
      textDecoration: ["active"],
      opacity: {
        7: ".075",
        15: ".15"
      },
      maxWidth: {
        "8xl": "86rem"
      },
      spacing: {
        128: "32rem"
      },
      zIndex: {
        "-1": "-1"
      },
      fontFamily: {
        nunito: ["Nunito", ...defaultTheme.fontFamily.sans],
        lato: ["Lato", ...defaultTheme.fontFamily.sans]
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            pre: {
              color: theme("colors.gray.700"),
              backgroundColor: theme("colors.gray.100"),
              lineHeight: 1.5
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              padding: "0.25rem",
              borderRadius: "3px",
              margin: "-0.25rem 1px"
            },
            "code::before": {
              content: "\"\""
            },
            "code::after": {
              content: "\"\""
            },
            "p:first-of-type": {
              fontSize: "1.125rem"
            }
          }
        },
        tint: {
          css: {
            pre: {
              color: theme("colors.gray.800"),
              backgroundColor: theme("colors.gray.150")
            }
          }
        },
        lg: {
          css: {
            pre: {
              lineHeight: 1.5
            },
            "p:first-of-type": {
              fontSize: "1.365rem"
            }
          }
        },
        xl: {
          css: {
            pre: {
              lineHeight: 1.5
            },
            "p:first-of-type": {
              fontSize: "1.365rem"
            }
          }
        },
        dark: {
          css: {
            color: theme("colors.white"),
            "[class~=\"lead\"]": { color: theme("colors.gray.400") },
            a: { color: theme("colors.red") },
            strong: { color: theme("colors.yellow") },
            "ul > li::before": { backgroundColor: theme("colors.gray.700") },
            hr: { borderColor: theme("colors.gray.800") },
            blockquote: {
              color: theme("colors.gray.100"),
              borderLeftColor: theme("colors.gray.800")
            },
            h1: { color: theme("colors.gray.100") },
            h2: { color: theme("colors.gray.100") },
            h3: { color: theme("colors.gray.100") },
            h4: { color: theme("colors.gray.100") },
            code: {
              color: theme("colors.gray.100"),
              backgroundColor: theme("colors.gray.1000")
            },
            "a code": { color: theme("colors.gray.100") },
            pre: {
              color: theme("colors.gray.200"),
              backgroundColor: theme("colors.gray.900")
            },
            thead: {
              color: theme("colors.gray.100"),
              borderBottomColor: theme("colors.gray.700")
            },
            "tbody tr": { borderBottomColor: theme("colors.gray.800") }
          }
        },
        primary: {
          css: {
            color: theme("colors.gray.50"),
            "[class~=\"lead\"]": { color: theme("colors.gray.400") },
            a: { color: theme("colors.gray.100") },
            strong: { color: theme("colors.gray.100") },
            "ul > li::before": { backgroundColor: theme("colors.gray.700") },
            hr: { borderColor: theme("colors.gray.800") },
            blockquote: {
              color: theme("colors.gray.100"),
              borderLeftColor: theme("colors.gray.800")
            },
            h1: { color: theme("colors.gray.100") },
            h2: { color: theme("colors.gray.100") },
            h3: { color: theme("colors.gray.100") },
            h4: { color: theme("colors.gray.100") },
            code: {
              color: theme("colors.gray.100"),
              backgroundColor: "rgba(0,0,0,0.15)"
            },
            "a code": { color: theme("colors.gray.100") },
            pre: {
              color: theme("colors.gray.200"),
              backgroundColor: "rgba(0,0,0,0.15)"
            },
            thead: {
              color: theme("colors.gray.100"),
              borderBottomColor: theme("colors.gray.700")
            },
            "tbody tr": { borderBottomColor: theme("colors.gray.800") }
          }
        }
      })
    }
  },
  variants: {
    extend: { typography: ["tint", "dark", "primary"] }
  },
  plugins: [require("@tailwindcss/typography")]
};
