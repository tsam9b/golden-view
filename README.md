# MotionHotel

A refined, fully static Astro 7 theme for boutique hotels, retreats and design-led stays. It is built without a CMS and uses **Motion** for elegant, reduced-motion-safe entrance choreography.

## Included

- Responsive luxury hotel homepage with an AVIF-optimized local hero image
- Rooms, experiences, about, contact, privacy, journal and article routes
- Custom 404, `robots.txt`, `llms.txt` and static `sitemap.xml`
- Canonical URLs, page-specific descriptions, Open Graph/Twitter metadata and semantic page structure
- Accessible skip link, responsive menu and high-contrast interactive states
- Zero CMS or external runtime requirement

## Development

```bash
npm install
npm run dev
npm run build
```

Update the placeholder production domain in `astro.config.mjs`, `public/robots.txt` and `public/sitemap.xml` before deployment. Replace the demonstration copy and the reservation form action with your own booking workflow.

## Card content

- Configure feature cards in `site.features` in `src/config/site.ts`. Image and background image names refer to files in `src/assets/gallery/`; text fields use translation keys from `src/i18n/locales/`. Add translations for each supported language when adding new keys.
- Room cards use the existing `room` array in `src/data/room.ts`, which also supplies the room detail pages. The card uses the room gallery's main image when available, otherwise the item's `image`. Room image filenames are configured in `src/data/room.ts` and resolved from `src/assets/room/`. If a file is missing, a warning is logged and the site logo is used as a placeholder. Add the expected file or update its filename to replace the placeholder.
- The gallery page uses room galleries from `src/assets/gallery/<gallery-name>/full/` when available. If none exist, it displays the images directly in `src/assets/gallery/` once as a shared gallery; each preview and its opened image come from the same source file. Missing individual room galleries are skipped with a warning when other room galleries exist. Room detail pages without gallery images omit the gallery and use the room item's image for the hero.
- Each feature or room item has a `classes` array for additional CSS classes on that card's outer element. Existing `feature`, image-position, and `room` classes remain in place.

## License

Copyright © Noel Dario Andres. All rights reserved. This theme is proprietary and may not be copied, redistributed or resold without written permission.

Theme creator: https://noel.marketing/astro-themes/
