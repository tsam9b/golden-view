// Main theme configuration - change only this file for your normal customization.
import { resolveTheme } from "./theme/resolver";
import type { DeepPartial, Theme } from "./theme/types";
import { presets, type PresetName } from "./theme/presets";

// Optional environment override:
// THEME_PRESET=luxury npm run dev
const envPreset = import.meta.env.THEME_PRESET as string | undefined;

// Set the complete theme preset here.
export const ACTIVE_PRESET: PresetName | null =
  envPreset && envPreset in presets
    ? (envPreset as PresetName)
    : "sunset";

// Override individual values from the selected preset here.
// Remove a property to keep the preset value.
export const overrides: DeepPartial<Theme> = {
  // palette: "sunset",
  // fonts: "friendly",
  // mode: "light",
  // radius: "pill",
};

const resolved = resolveTheme(ACTIVE_PRESET, overrides);

export const theme = resolved.theme;
export const palette = resolved.palette;
export const themeColor = resolved.themeColor;
export const fontsUrl = resolved.fontsUrl;
export const themeStyle = resolved.themeStyle;
export const themeAttrs = resolved.themeAttrs;
