import type { Restaurant } from '../types';
import type { Language } from '../context/LanguageContext';

/** True when the restaurant has a deal (e.g. discount in specific hours). */
export function restaurantHasDeal(restaurant: Restaurant): boolean {
  return (
    (restaurant.specialDiscountHours != null && restaurant.specialDiscountHours.length > 0) ||
    Boolean(restaurant.specialDiscountText ?? restaurant.specialDiscountTextAr)
  );
}

/** Localized deal/discount text for display (e.g. on card). Returns null if no deal. */
export function getRestaurantDealText(restaurant: Restaurant, lang: Language): string | null {
  if (!restaurantHasDeal(restaurant)) return null;
  const text =
    lang === 'ar' && restaurant.specialDiscountTextAr
      ? restaurant.specialDiscountTextAr
      : restaurant.specialDiscountText ?? restaurant.specialDiscountTextAr ?? null;
  return text ?? null;
}

/**
 * Picks the string for the current language from backend-style content.
 * Use for any API field that can be localized (e.g. { en: "...", ar: "..." } or plain string).
 */
export function getLocalized(
  value: string | { en?: string; ar?: string } | null | undefined,
  lang: Language
): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const text = lang === 'ar' ? value.ar ?? value.en : value.en ?? value.ar;
  return text ?? '';
}

export function getRestaurantName(restaurant: Restaurant, lang: Language): string {
  return lang === 'ar' && restaurant.nameAr ? restaurant.nameAr : restaurant.name;
}

export function getRestaurantLocation(restaurant: Restaurant, lang: Language): string {
  return lang === 'ar' && restaurant.locationAr ? restaurant.locationAr : restaurant.location;
}

export function getRestaurantDescription(restaurant: Restaurant, lang: Language): string {
  return lang === 'ar' && restaurant.descriptionAr
    ? restaurant.descriptionAr
    : restaurant.description;
}

/** Use for address lines when backend sends addressLine1 / addressLine1Ar (or addressLine2). */
export function getRestaurantAddressLine1(restaurant: Restaurant, lang: Language): string {
  const raw = restaurant.addressLine1 ?? restaurant.location;
  if (lang === 'ar' && restaurant.addressLine1Ar) return restaurant.addressLine1Ar;
  return raw;
}

export function getRestaurantAddressLine2(restaurant: Restaurant, lang: Language): string {
  const raw = restaurant.addressLine2 ?? '';
  if (lang === 'ar' && restaurant.addressLine2Ar) return restaurant.addressLine2Ar;
  return raw;
}
