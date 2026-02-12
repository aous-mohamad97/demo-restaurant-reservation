import { useMemo, useState } from 'react';
import type { Restaurant, FilterState } from '../types';
import { DEFAULT_FILTER_STATE } from '../constants';
import { filterRestaurants } from '../utils/filterRestaurants';

export function useRestaurantFilters(restaurants: Restaurant[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const filteredRestaurants = useMemo(
    () => filterRestaurants(restaurants, filters),
    [restaurants, filters]
  );

  const hasActiveFilters =
    filters.dealsOnly ||
    filters.minRating > 0 ||
    filters.priceRange.length > 0 ||
    filters.categories.length > 0 ||
    filters.features.length > 0 ||
    filters.distance !== '' ||
    filters.suggested.length > 0 ||
    filters.dietaryRestrictions.length > 0;

  return { filters, setFilters, filteredRestaurants, hasActiveFilters };
}
