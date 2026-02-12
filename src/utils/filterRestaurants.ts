import type { Restaurant, FilterState } from '../types';
import { restaurantHasDeal } from './restaurant';

const FEATURE_TO_KEY: Record<string, keyof Restaurant> = {
  suitableForLunch: 'suitableForLunch',
  suitableForChildren: 'suitableForChildren',
  suitableForGroups: 'suitableForGroups',
  dogsAllowed: 'dogsAllowed',
  fullBar: 'fullBar',
  suitableForBrunch: 'suitableForBrunch',
};

const SUGGESTED_TO_KEY: Record<string, keyof Restaurant> = {
  openNow: 'openNow',
  offersDelivery: 'offersDelivery',
  takeawayAvailable: 'takeawayAvailable',
  suitableForDinner: 'suitableForDinner',
  newAndTrendy: 'newAndTrendy',
  terrace: 'terrace',
};

const DIETARY_TO_KEY: Record<string, keyof Restaurant> = {
  halal: 'halal',
  vegan: 'vegan',
  vegetarian: 'vegetarian',
  kosher: 'kosher',
};

function matchesFeature(restaurant: Restaurant, feature: string): boolean {
  const key = FEATURE_TO_KEY[feature];
  if (!key) return true;
  return restaurant[key] === true;
}

function matchesSuggested(restaurant: Restaurant, suggested: string): boolean {
  const key = SUGGESTED_TO_KEY[suggested];
  if (!key) return true;
  return restaurant[key] === true;
}

function matchesDietary(restaurant: Restaurant, dietary: string): boolean {
  const key = DIETARY_TO_KEY[dietary];
  if (!key) return false;
  return restaurant[key] === true;
}

export function filterRestaurants(
  restaurants: Restaurant[],
  filters: FilterState
): Restaurant[] {
  let filtered: Restaurant[] = [...restaurants];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        (r.nameAr?.toLowerCase().includes(query) ?? false) ||
        r.description.toLowerCase().includes(query) ||
        (r.descriptionAr?.toLowerCase().includes(query) ?? false) ||
        r.location.toLowerCase().includes(query) ||
        (r.locationAr?.toLowerCase().includes(query) ?? false) ||
        r.categories.some((cat) => cat.toLowerCase().includes(query))
    );
  }

  if (filters.location && filters.location !== 'All Locations') {
    filtered = filtered.filter((r) => r.location.includes(filters.location));
  }

  if (filters.minRating > 0) {
    filtered = filtered.filter((r) => r.rating >= filters.minRating);
  }

  if (filters.priceRange.length > 0) {
    filtered = filtered.filter((r) => filters.priceRange.includes(r.priceRange));
  }

  if (filters.categories.length > 0) {
    filtered = filtered.filter((r) =>
      r.categories.some((cat) => filters.categories.includes(cat))
    );
  }

  if (filters.features.length > 0) {
    filtered = filtered.filter((r) =>
      filters.features.every((f) => matchesFeature(r, f))
    );
  }

  if (filters.suggested.length > 0) {
    filtered = filtered.filter((r) =>
      filters.suggested.every((s) => matchesSuggested(r, s))
    );
  }

  if (filters.dietaryRestrictions.length > 0) {
    filtered = filtered.filter((r) =>
      filters.dietaryRestrictions.some((d) => matchesDietary(r, d))
    );
  }

  if (filters.dealsOnly) {
    filtered = filtered.filter((r) => restaurantHasDeal(r));
  }

  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'deliveryTime': {
        const aTime = parseInt(a.deliveryTime.split('-')[0], 10) || 0;
        const bTime = parseInt(b.deliveryTime.split('-')[0], 10) || 0;
        return aTime - bTime;
      }
      default:
        return 0;
    }
  });

  return filtered;
}
