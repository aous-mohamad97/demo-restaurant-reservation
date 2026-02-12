# i18n vs Backend Data

This app is built so that **static UI content** and **backend-driven content** are handled separately. When you connect a backend, follow this pattern.

## 1. Static UI content → i18n translations

All **fixed text** that the app shows (labels, buttons, section titles, placeholders, errors) must come from **translations**, not from the backend.

- **Use:** `t('key')` from `useTranslations()`.
- **Source:** `src/i18n/translations.ts` (en / ar).
- **Examples:** "Book a table", "Location", "Recommended reviews", "Filter by rating", "Search within reviews".

When the user switches language (e.g. EN ↔ AR), these strings switch via the same translation file.

## 2. Backend / data-driven content → by current language

Content that **comes from the API** (restaurant names, descriptions, addresses, review text, etc.) should be **shown in the current UI language** using the value the backend returns for that language.

- **Use:** Prefer **helper functions** that take `(entity, lang)` and return the right string:
  - `getRestaurantName(restaurant, lang)`
  - `getRestaurantLocation(restaurant, lang)`
  - `getRestaurantDescription(restaurant, lang)`
  - `getRestaurantAddressLine1(restaurant, lang)` / `getRestaurantAddressLine2(restaurant, lang)`
- **Optional:** For generic API fields (e.g. review body, category names): `getLocalized(value, lang)` in `src/utils/restaurant.ts`. It supports:
  - Plain string (same for all languages)
  - Object: `{ en: string, ar?: string }` or `{ en?: string, ar: string }`

Backend can send localized content in either way:

- **Per-field variants:** e.g. `name`, `nameAr` (and optionally `addressLine1`, `addressLine1Ar`, etc.).
- **Nested object:** e.g. `name: { en: "...", ar: "..." }`. In that case use `getLocalized(restaurant.name, lang)` (and adapt types accordingly).

Do **not** put backend content into `translations.ts`; keep translations for UI only.

## 3. Summary

| Content type              | Source        | How to display                          |
|---------------------------|---------------|-----------------------------------------|
| Buttons, labels, titles   | i18n          | `t('section.key')`                      |
| Restaurant name/address   | Backend / data| `getRestaurantName(...)`, `getRestaurantLocation(...)`, etc. |
| Review text               | Backend / data| By lang (e.g. `textAr` vs `text` or `getLocalized(review.text, lang)`) |
| Categories                | Backend / data| As returned for current lang (add *Ar or localized object when API supports it) |

This keeps the app **data-driven** and ready for the backend while keeping **all basic UI** in i18n.
