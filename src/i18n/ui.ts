import en, { type Translations, type UiKey } from "./locales/en";
import el from "./locales/el";
import de from "./locales/de";
import fr from "./locales/fr";
import it from "./locales/it";
import ru from "./locales/ru";
import sv from "./locales/sv";
import no from "./locales/no";

export const locales = ["en", "el", "de", "fr", "it", "ru", "sv", "no"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ru: "Русский",
  sv: "Svenska",
  no: "Norsk",
};

export type { UiKey };
export const ui: Record<Locale, Translations> = { en, el, de, fr, it, ru, sv, no };
