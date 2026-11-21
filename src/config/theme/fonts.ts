export interface FontSet {
  serif: string;
  sans: string;
  mono: string;
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

