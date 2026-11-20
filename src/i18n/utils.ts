import {
  defaultLocale,
  locales,
  ui,
  type Locale,
  type UiKey,
} from "./ui";
import type { RoomItem } from "../data/rooms";

export type { UiKey };

export function getLocale(value: string | undefined): Locale {
  return (locales as readonly string[]).includes(value ?? "")
    ? (value as Locale)
    : defaultLocale;
}

export function useTranslations(locale: Locale) {
  return (key: UiKey, vars?: Record<string, string | number>): string => {
    const text = ui[locale][key] ?? ui[defaultLocale][key];
    return vars
      ? text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`))
      : text;
  };
}

// Prefix internal paths with the locale; external links are left untouched.
export function localizePath(locale: Locale, href: string): string {
  if (!href.startsWith("/") || locale === defaultLocale) return href;
  return href === "/" ? `/${locale}/` : `/${locale}${href}`;
}

// Strip any locale prefix from a pathname.
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if ((locales as readonly string[]).includes(first) && first !== defaultLocale) {
    return "/" + rest.join("/");
  }
  return pathname;
}

const facilityKeys: Record<string, UiKey> = {
  "Snacks & Drinks included": "facility.snacks",
  "Air-conditioning": "facility.ac",
  "Wi-fi Internet & TV": "facility.wifi",
  "Private Bathroom with Shower": "facility.bathroom",
  "Bathroom Amenities": "facility.amenities",
  "Two Toilets": "facility.toilets2",
  "Three toilets": "facility.toilets3",
  "Refrigerator & Kettle": "facility.fridge",
};

export function translateFacility(locale: Locale, facility: string): string {
  const key = facilityKeys[facility];
  return key ? useTranslations(locale)(key) : facility;
}

// Builds the translated paragraphs describing a room from its data.
export function roomDescription(locale: Locale, item: RoomItem): string[] {
  const t = useTranslations(locale);
  const about = `room.${item.slug}.about` as UiKey;
  const cabins = `room.${item.slug}.cabins` as UiKey;
  const hasAbout = about in ui[defaultLocale];
  const dayTrips = t("room.dayTrips", { n: item.dayTrips });

  if (cabins in ui[defaultLocale]) {
    return [dayTrips, ...(hasAbout ? [t(about)] : []), t(cabins)];
  }

  return [
    ...(hasAbout ? [t(about)] : []),
    dayTrips,
    ...(item.charter
      ? [
          t("room.charters", {
            n: item.charter.guests,
            cabins: item.charter.cabins,
          }),
        ]
      : []),
  ];
}
