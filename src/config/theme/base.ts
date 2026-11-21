import type { Theme } from "./types";

export const baseTheme: Theme = {
  palette: "classic",
  fonts: "classic",
  mode: "light",
  radius: "none",
  spacing: "default",
  container: "full",
  headings: { transform: "none", tracking: "normal", weight: null },
  button: "filled",
  header: { style: "transparent", sticky: false, logo: "left" },
  hero: {
    overlay: 0.55,
    height: "full",
    mode: "slideshow",
    autoplay: true,
    intervalMs: 5000,
  },
  cards: { shadow: "none", aspect: "auto" },
  imageFilter: "none",
  roomColumns: 3,
  footer: "full",
  motion: "on",
  mapHeight: "450px",
  homeSections: [
    "slideshow",
    "room",
    "intro",
    "services",
    "features",
    "contact",
    "map",
  ],
};

