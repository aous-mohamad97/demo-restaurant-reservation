/**
 * Restaurant model. When linked to a backend:
 * - UI labels (buttons, section titles, etc.) come from i18n (t()).
 * - Content (name, description, location, etc.) is shown by current language:
 *   use getRestaurantName(), getRestaurantLocation(), getRestaurantDescription() and
 *   optional *Ar fields so the API can return localized content.
 */
export interface Restaurant {
  id: string;
  name: string;
  location: string;
  nameAr?: string;
  locationAr?: string;
  descriptionAr?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine1Ar?: string;
  addressLine2Ar?: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string; // Keep for backward compatibility
  images: string[]; // Array of images for carousel
  categories: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  deliveryTime: string;
  deliveryFee: number;
  specialDiscountHours?: string[]; // e.g. ['18:00', '19:00']
  specialDiscountText?: string;
  specialDiscountTextAr?: string;
  acceptsReservations?: boolean;
  accessible?: boolean;
  additionalAttributesCount?: number;
  closedNow?: boolean;
  casual?: boolean;
  happyHour?: boolean;
  television?: boolean;
  wifi?: boolean;
  driveIn?: boolean;
  idealForDinner?: boolean;
  // Features
  suitableForLunch?: boolean;
  suitableForChildren?: boolean;
  suitableForGroups?: boolean;
  dogsAllowed?: boolean;
  fullBar?: boolean;
  suitableForBrunch?: boolean;
  // Suggested
  openNow?: boolean;
  offersDelivery?: boolean;
  takeawayAvailable?: boolean;
  suitableForDinner?: boolean;
  newAndTrendy?: boolean;
  terrace?: boolean;
  // Dietary Restrictions
  halal?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  kosher?: boolean;
  // Opening hours
  openingHours?: Array<{
    day: string;
    hours: string;
    note?: string;
    isClosed?: boolean;
  }>;
  /** Latitude for map display (e.g. Leaflet). */
  latitude?: number;
  /** Longitude for map display (e.g. Leaflet). */
  longitude?: number;
}

export interface FilterState {
  searchQuery: string;
  location: string;
  minRating: number;
  priceRange: string[];
  categories: string[];
  sortBy: 'rating' | 'reviews' | 'name' | 'deliveryTime';
  /** When true, show only restaurants that have a deal (e.g. discount in specific hours). */
  dealsOnly: boolean;
  // Features
  features: string[];
  // Distance
  distance: string;
  // Suggested
  suggested: string[];
  // Dietary Restrictions
  dietaryRestrictions: string[];
}

/** Keys of FilterState whose value is string[] (for generic array toggle) */
export type FilterStateArrayKey =
  | 'priceRange'
  | 'categories'
  | 'features'
  | 'suggested'
  | 'dietaryRestrictions';

/** Review model. Backend may send localized content via textAr (use getLocalized or pick by lang). */
export interface Review {
  id: string;
  userName: string;
  userLocation: string;
  badge?: string;
  reviewsCount: number;
  rating: number;
  date: string;
  text: string;
  textAr?: string;
  /** Optional photos attached to this review (used in the details page). */
  photos?: string[];
  /** Reaction counts for badges in the details page. */
  helpfulCount?: number;
  thanksCount?: number;
  loveThisCount?: number;
  ohNoCount?: number;
}

/** Lightweight record of a reservation made by the current customer (stored client-side). */
export interface ReservationActivity {
  id: string;
  restaurantId: string;
  restaurantName: string;
  persons: number;
  time: string;
  createdAt: string; // ISO string
}
