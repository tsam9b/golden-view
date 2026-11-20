export const palettes = {
  classic: "#10253b",
  ocean: "#0b3954",
  sunset: "#3b1f2b",
  forest: "#1c3328",
  midnight: "#0d1321",
  rose: "#2d2a3e",
} as const;

export type PaletteName = keyof typeof palettes;


interface FontSet {
  serif: string;
  sans: string;
  mono: string;
  // Google Fonts "family=" params, without the leading "family="
  google: string[];
}

export const fontSets = {
  classic: {
    serif: "'Playfair Display', serif",
    sans: "Manrope, sans-serif",
    mono: "'DM Mono', monospace",
    google: [
      "Playfair+Display:ital,wght@0,500;0,600;1,500",
      "Manrope:wght@400;500;600;700",
      "DM+Mono:wght@400;500",
    ],
  },
  modern: {
    serif: "'DM Serif Display', serif",
    sans: "Inter, sans-serif",
    mono: "'JetBrains Mono', monospace",
    google: [
      "DM+Serif+Display:ital@0;1",
      "Inter:wght@400;500;600;700",
      "JetBrains+Mono:wght@400;500",
    ],
  },
  elegant: {
    serif: "'Cormorant Garamond', serif",
    sans: "'Jost', sans-serif",
    mono: "'IBM Plex Mono', monospace",
    google: [
      "Cormorant+Garamond:ital,wght@0,500;0,600;1,500",
      "Jost:wght@400;500;600;700",
      "IBM+Plex+Mono:wght@400;500",
    ],
  },
  friendly: {
    serif: "'Lora', serif",
    sans: "'Nunito Sans', sans-serif",
    mono: "'Space Mono', monospace",
    google: [
      "Lora:ital,wght@0,500;0,600;1,500",
      "Nunito+Sans:wght@400;600;700",
      "Space+Mono:wght@400;700",
    ],
  },
} satisfies Record<string, FontSet>;

export type FontSetName = keyof typeof fontSets;


export type HomeSection =
  | "slideshow"
  | "intro"
  | "services"
  | "features"
  | "contact"
  | "map";

export interface Theme {
  palette: PaletteName;
  fonts: FontSetName;
  /** "auto" follows the visitor's OS setting. */
  mode: "light" | "dark" | "auto";
  radius: "none" | "soft" | "round" | "pill";
  spacing: "compact" | "default" | "spacious";
  /** "full" removes the max width; the others cap the width of .section blocks. */
  container: "full" | "wide" | "default" | "narrow";
  headings: {
    transform: "none" | "uppercase";
    tracking: "tight" | "normal" | "wide";
    /** null keeps the existing per-heading weights. */
    weight: null | 400 | 500 | 600 | 700;
  };
  button: "filled" | "outline" | "ghost";
  header: {
    style: "transparent" | "solid";
    sticky: boolean;
    logo: "left" | "center";
  };
  hero: {
    /** Dark overlay strength, 0 to 1. */
    overlay: number;
    height: "full" | "tall" | "medium";
    mode: "slideshow" | "static";
    autoplay: boolean;
    intervalMs: number;
  };
  cards: {
    shadow: "none" | "soft" | "strong";
    aspect: "auto" | "4/3" | "16/9" | "1/1";
  };
  imageFilter: "none" | "muted" | "warm" | "mono";
  roomColumns: 2 | 3 | 4;
  footer: "full" | "minimal";
  motion: "on" | "off";
  mapHeight: string;
  /** Order matters; remove an entry to hide that section. */
  homeSections: HomeSection[];
}

const base: Theme = {
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

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

// A preset bundles several settings so one value gives a complete look.
export const presets = {
  classic: {},
  modern: {
    palette: "midnight",
    fonts: "modern",
    radius: "soft",
    button: "outline",
    cards: { shadow: "soft", aspect: "4/3" },
    header: { style: "solid", sticky: true, logo: "left" },
    headings: { transform: "none", tracking: "tight", weight: 600 },
  },
  elegant: {
    palette: "rose",
    fonts: "elegant",
    spacing: "spacious",
    container: "default",
    headings: { transform: "uppercase", tracking: "wide", weight: 500 },
    button: "ghost",
    imageFilter: "warm",
  },
  nautical: {
    palette: "ocean",
    fonts: "friendly",
    radius: "round",
    cards: { shadow: "strong", aspect: "16/9" },
    roomColumns: 2,
    header: { style: "transparent", sticky: true, logo: "center" },
  },
  luxury: {
    palette: "midnight",
    fonts: "elegant",
    mode: "dark",
    spacing: "spacious",
    container: "default",
    headings: { transform: "uppercase", tracking: "wide", weight: 500 },
    button: "outline",
    header: { style: "transparent", sticky: true, logo: "center" },
    hero: { overlay: 0.6, height: "full", autoplay: true, intervalMs: 7000 },
    imageFilter: "muted",
    roomColumns: 2,
  },
  minimal: {
    palette: "classic",
    fonts: "modern",
    spacing: "compact",
    container: "narrow",
    button: "ghost",
    radius: "none",
    hero: { overlay: 0.3, height: "medium", mode: "static" },
    cards: { shadow: "none", aspect: "4/3" },
    roomColumns: 4,
    footer: "minimal",
    motion: "off",
    homeSections: ["slideshow", "room", "intro", "contact"],
  },
  sunset: {
    palette: "sunset",
    fonts: "friendly",
    radius: "pill",
    button: "filled",
    cards: { shadow: "soft", aspect: "1/1" },
    imageFilter: "warm",
    hero: { overlay: 0.4, height: "tall" },
    homeSections: ["slideshow", "intro", "room", "features", "services", "contact", "map"],
  },
  night: {
    palette: "midnight",
    fonts: "modern",
    mode: "dark",
    radius: "soft",
    hero: { overlay: 0.7 },
  },
} satisfies Record<string, DeepPartial<Theme>>;

export type PresetName = keyof typeof presets;

// Switch the whole look by changing this one value (null = base theme).
// You can also override it per run: THEME_PRESET=luxury npm run dev
const envPreset = import.meta.env.THEME_PRESET as string | undefined;
export const ACTIVE_PRESET: PresetName | null =
  envPreset && envPreset in presets ? (envPreset as PresetName) : "classic";

// Tweak individual settings on top of the active preset, e.g.
// { palette: "ocean", mode: "auto" }. Keep empty to use the preset as-is.
const overrides: DeepPartial<Theme> = {};

const preset: DeepPartial<Theme> = ACTIVE_PRESET ? presets[ACTIVE_PRESET] : {};

const merge = <T extends object>(a: T, ...parts: DeepPartial<T>[]): T => {
  const out: Record<string, unknown> = { ...a };
  for (const part of parts) {
    for (const [k, v] of Object.entries(part)) {
      if (v === undefined) continue;
      const cur = out[k];
      out[k] =
        v && typeof v === "object" && !Array.isArray(v) && cur
          ? merge(cur as object, v as object)
          : v;
    }
  }
  return out as T;
};

export const theme: Theme = merge(base, preset, overrides);

const f = fontSets[theme.fonts];

export const themeColor = palettes[theme.palette];

export const fontsUrl = `https://fonts.googleapis.com/css2?${f.google
  .map((x) => `family=${x}`)
  .join("&")}&display=swap`;

const heroHeights = { full: "100svh", tall: "85svh", medium: "65svh" };
const containers = { full: "none", wide: "1400px", default: "1200px", narrow: "1000px" };

// Inline CSS variables applied to <html>.
export const themeStyle = [
  `--serif: ${f.serif}`,
  `--sans: ${f.sans}`,
  `--mono: ${f.mono}`,
  `--hero-overlay: ${theme.hero.overlay}`,
  `--hero-height: ${heroHeights[theme.hero.height]}`,
  `--container-max: ${containers[theme.container]}`,
  `--room-cols: ${theme.roomColumns}`,
  `--card-aspect: ${theme.cards.aspect.replace("/", " / ")}`,
  theme.headings.weight ? `--h-weight: ${theme.headings.weight}` : "",
]
  .filter(Boolean)
  .join("; ");

// Data attributes applied to <html>; theme.css keys off these.
export const themeAttrs: Record<string, string> = {
  "data-palette": theme.palette,
  "data-mode": theme.mode,
  "data-radius": theme.radius,
  "data-spacing": theme.spacing,
  "data-button": theme.button,
  "data-header": theme.header.style,
  "data-header-sticky": String(theme.header.sticky),
  "data-logo": theme.header.logo,
  "data-card-shadow": theme.cards.shadow,
  "data-card-aspect": theme.cards.aspect,
  "data-img-filter": theme.imageFilter,
  "data-footer": theme.footer,
  "data-motion": theme.motion,
  "data-h-transform": theme.headings.transform,
  "data-h-tracking": theme.headings.tracking,
  ...(theme.headings.weight ? { "data-h-weight": "" } : {}),
};
