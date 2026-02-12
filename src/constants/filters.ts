import type { FilterState } from '../types';

export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  location: 'All Locations',
  minRating: 0,
  priceRange: [],
  categories: [],
  sortBy: 'rating',
  dealsOnly: false,
  features: [],
  distance: '',
  suggested: [],
  dietaryRestrictions: [],
};

export const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$'] as const;

export const SORT_OPTIONS = [
  { value: 'rating' as const, key: 'filters.sortByRating' },
  { value: 'reviews' as const, key: 'filters.sortByReviews' },
  { value: 'name' as const, key: 'filters.sortByName' },
  { value: 'deliveryTime' as const, key: 'filters.sortByDeliveryTime' },
] as const;

export const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0, 0] as const;

export const SUGGESTED_OPTIONS = [
  { value: 'openNow', key: 'filters.suggestedOpenNow' },
  { value: 'offersDelivery', key: 'filters.suggestedOffersDelivery' },
  { value: 'takeawayAvailable', key: 'filters.suggestedTakeawayAvailable' },
  { value: 'suitableForDinner', key: 'filters.suggestedSuitableForDinner' },
  { value: 'newAndTrendy', key: 'filters.suggestedNewAndTrendy' },
  { value: 'terrace', key: 'filters.suggestedTerrace' },
] as const;

export const FEATURES_OPTIONS = [
  { value: 'suitableForLunch', key: 'filters.featuresSuitableForLunch' },
  { value: 'suitableForChildren', key: 'filters.featuresSuitableForChildren' },
  { value: 'suitableForGroups', key: 'filters.featuresSuitableForGroups' },
  { value: 'dogsAllowed', key: 'filters.featuresDogsAllowed' },
  { value: 'fullBar', key: 'filters.featuresFullBar' },
  { value: 'suitableForBrunch', key: 'filters.featuresSuitableForBrunch' },
] as const;

export const DIETARY_OPTIONS = [
  { value: 'halal', key: 'filters.dietaryHalal' },
  { value: 'vegan', key: 'filters.dietaryVegan' },
  { value: 'vegetarian', key: 'filters.dietaryVegetarian' },
  { value: 'kosher', key: 'filters.dietaryKosher' },
] as const;

export const DISTANCE_OPTIONS = [
  { value: 'asTheCrowFlies', key: 'filters.distanceAsTheCrowFlies' },
  { value: 'byCar', key: 'filters.distanceByCar' },
  { value: 'byBike', key: 'filters.distanceByBike' },
  { value: 'onFoot', key: 'filters.distanceOnFoot' },
  { value: 'within500m', key: 'filters.distanceWithin500m' },
] as const;
