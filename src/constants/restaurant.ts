export const DEFAULT_OPENING_HOURS: Array<{
  day: string;
  hours: string;
  note?: string;
  isClosed?: boolean;
}> = [
  { day: 'Mon', hours: '12:00 PM - 11:00 PM' },
  { day: 'Tue', hours: '12:00 PM - 11:00 PM' },
  { day: 'Wed', hours: '12:00 PM - 11:00 PM' },
  { day: 'Thu', hours: '12:00 PM - 11:00 PM' },
  { day: 'Fri', hours: '12:00 PM - 12:00 AM (the following day)' },
  { day: 'Sat', hours: '12:00 PM - 12:00 AM (the following day)' },
  { day: 'Sun', hours: '12:00 PM - 10:00 PM' },
];

// Inline SVG placeholder (no network request); use when external images fail
const PLACEHOLDER_SVG = (w: number, h: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect fill="#f3f4f6" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="18">Restaurant</text></svg>`
  )}`;
export const PLACEHOLDER_IMAGE_URL = PLACEHOLDER_SVG(400, 300);
export const PLACEHOLDER_IMAGE_URL_HERO = PLACEHOLDER_SVG(1200, 600);

export const formatPriceRange = (priceRange: string) => priceRange || '$$';
