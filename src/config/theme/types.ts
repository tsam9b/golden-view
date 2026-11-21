import type { FontSetName } from "./fonts";
import type { PaletteName } from "./palettes";

export type HomeSection =
  | "slideshow"
  | "room"
  | "intro"
  | "services"
  | "features"
  | "contact"
  | "map";

export interface Theme {
  palette: PaletteName;
  fonts: FontSetName;
  mode: "light" | "dark" | "auto";
  radius: "none" | "soft" | "round" | "pill";
  spacing: "compact" | "default" | "spacious";
  container: "full" | "wide" | "default" | "narrow";
  headings: {
    transform: "none" | "uppercase";
    tracking: "tight" | "normal" | "wide";
    weight: null | 400 | 500 | 600 | 700;
  };
  button: "filled" | "outline" | "ghost";
  header: {
    style: "transparent" | "solid";
    sticky: boolean;
    logo: "left" | "center";
  };
  hero: {
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
  homeSections: HomeSection[];
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

