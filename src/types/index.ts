export interface Restaurant {
  id: string;
  name: string;
  location: string;
  addressLine1?: string;
  addressLine2?: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string; // Keep for backward compatibility
  images: string[]; // Array of images for carousel
  categories: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
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
}

export interface FilterState {
  searchQuery: string;
  location: string;
  minRating: number;
  priceRange: string[];
  categories: string[];
  cuisine: string[];
  sortBy: 'rating' | 'reviews' | 'name' | 'deliveryTime';
  // Features
  features: string[];
  // Distance
  distance: string;
  // Suggested
  suggested: string[];
  // Dietary Restrictions
  dietaryRestrictions: string[];
}
