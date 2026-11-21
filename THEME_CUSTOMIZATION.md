# Theme and Font Customization

Use `src/config/theme.ts` as the only file for normal theme customization.
Palette, font, preset, and base definitions are kept in separate files under
`src/config/theme/`, so you do not need to edit or navigate the resolver code.

## File map

- `src/config/theme.ts`: active preset and individual overrides
- `src/config/theme/palettes.ts`: available colors
- `src/config/theme/fonts.ts`: available font sets
- `src/config/theme/presets.ts`: complete theme presets
- `src/config/theme/base.ts`: fallback values
- `src/config/theme/resolver.ts`: internal merge and CSS-variable logic

## Change the whole theme

Set `ACTIVE_PRESET` in `src/config/theme.ts`:

```ts
export const ACTIVE_PRESET: PresetName | null = "classic";
```

Replace `"classic"` with one of:

- `classic`
- `modern`
- `elegant`
- `nautical`
- `luxury`
- `minimal`
- `sunset`
- `night`

The selected preset controls the palette, fonts, colors, mode, spacing, radius,
header, cards, hero, and other visual settings.

A preset can also be selected only for a dev run:

```bash
THEME_PRESET=luxury npm run dev
```

## Change colors without changing the theme

To keep the active preset and change only its palette, update `overrides` in
`src/config/theme.ts`:

```ts
const overrides: DeepPartial<Theme> = {
  palette: "ocean",
};
```

Available palette names are:

- `classic`
- `ocean`
- `sunset`
- `forest`
- `midnight`
- `rose`

The active palette supplies the CSS variables `--navy`, `--sand`, `--gold`,
`--white`, and `--line`. Styles that use those variables update automatically.

For completely custom colors, edit the selected palette in
`src/config/theme/palettes.ts`:

```ts
sunset: {
  primary: "#3b1f2b",
  light: "#f8ebe0",
  accent: "#db883f",
  surface: "#fffaf5",
  border: "#dcc8bb",
},
```

Do not rename the palette keys or the `primary`, `light`, `accent`, `surface`,
and `border` properties unless their usages are updated too.

## Change fonts

The font collections are in `fontSets` in `src/config/theme/fonts.ts`.

Use a collection without changing the rest of the preset:

```ts
const overrides: DeepPartial<Theme> = {
  fonts: "modern",
};
```

Available font set names are:

- `classic`
- `modern`
- `elegant`
- `friendly`

Each font set defines:

- `serif`: used for headings and display text
- `sans`: used for body text
- `mono`: used for monospace text
- `google`: Google Fonts parameters loaded at runtime

To customize a font set, update both its CSS font family and its Google Fonts
entry. For example:

```ts
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
```

The resulting CSS variables are:

- `--serif`
- `--sans`
- `--mono`

## Change one setting at a time

The `overrides` object accepts individual theme properties and keeps everything
else from the active preset:

```ts
const overrides: DeepPartial<Theme> = {
  palette: "ocean",
  fonts: "modern",
  mode: "dark",
  radius: "soft",
  spacing: "spacious",
  roomColumns: 2,
};
```

Nested settings can also be overridden:

```ts
const overrides: DeepPartial<Theme> = {
  header: {
    style: "solid",
    sticky: true,
  },
  hero: {
    overlay: 0.7,
    height: "tall",
  },
};
```

Leave `overrides` empty to use the selected preset unchanged:

```ts
const overrides: DeepPartial<Theme> = {};
```

## Where the resulting styles are used

- `src/config/theme.ts`: theme values, presets, palettes, fonts, and overrides
- `src/layouts/BaseLayout.astro`: applies the generated variables and data attributes
- `src/styles/theme.css`: defines behavior for modes, radius, spacing, headings,
  cards, header, footer, and other theme options
- `src/styles/global.css`: uses the generated variables such as `--navy`,
  `--gold`, `--serif`, and `--sans`
