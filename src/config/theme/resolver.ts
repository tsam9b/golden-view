import { baseTheme } from "./base";
import { fontSets } from "./fonts";
import { palettes } from "./palettes";
import { presets, type PresetName } from "./presets";
import type { DeepPartial, Theme } from "./types";

const merge = <T extends object>(base: T, ...parts: DeepPartial<T>[]): T => {
  const out: Record<string, unknown> = { ...base };

  for (const part of parts) {
    for (const [key, value] of Object.entries(part)) {
      if (value === undefined) continue;
      const current = out[key];
      out[key] =
        value && typeof value === "object" && !Array.isArray(value) && current
          ? merge(current as object, value as object)
          : value;
    }
  }

  return out as T;
};

const heroHeights = { full: "100svh", tall: "85svh", medium: "65svh" };
const containers = { full: "none", wide: "1400px", default: "1200px", narrow: "1000px" };

const hexToRgb = (hex: string) =>
  [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)).join(", ");

export function resolveTheme(
  activePreset: PresetName | null,
  overrides: DeepPartial<Theme>,
) {
  const preset = activePreset ? presets[activePreset] : {};
  const theme = merge(baseTheme, preset, overrides);
  const font = fontSets[theme.fonts];
  const palette = palettes[theme.palette];

  const themeStyle = [
    `--navy: ${palette.primary}`,
    `--navy-rgb: ${hexToRgb(palette.primary)}`,
    `--sand: ${palette.light}`,
    `--gold: ${palette.accent}`,
    `--accent: ${palette.accent}`,
    `--blue: ${palette.blue}`,
    `--blue-dark: ${palette.blueDark}`,
    `--white: ${palette.surface}`,
    `--line: ${palette.border}`,
    `--serif: ${font.serif}`,
    `--sans: ${font.sans}`,
    `--mono: ${font.mono}`,
    `--hero-overlay: ${theme.hero.overlay}`,
    `--hero-height: ${heroHeights[theme.hero.height]}`,
    `--container-max: ${containers[theme.container]}`,
    `--room-cols: ${theme.roomColumns}`,
    `--card-aspect: ${theme.cards.aspect.replace("/", " / ")}`,
    theme.headings.weight ? `--h-weight: ${theme.headings.weight}` : "",
  ].filter(Boolean).join("; ");

  const themeAttrs: Record<string, string> = {
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

  const fontsUrl = `https://fonts.googleapis.com/css2?${font.google
    .map((family) => `family=${family}`)
    .join("&")}&display=swap`;

  return {
    theme,
    palette,
    themeColor: palette.primary,
    fontsUrl,
    themeStyle,
    themeAttrs,
  };
}
