import React, { useState } from 'react';
import { FilterState } from '../types';
import { categories, cuisines } from '../data/restaurants';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    sort: true,
    price: true,
    rating: true,
    suggested: true,
    features: true,
    dietary: true,
    category: true,
    cuisine: true,
    distance: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceRangeToggle = (price: string) => {
    const newPriceRange = filters.priceRange.includes(price)
      ? filters.priceRange.filter((p) => p !== price)
      : [...filters.priceRange, price];
    onFilterChange({
      ...filters,
      priceRange: newPriceRange,
    });
  };

  const handleSuggestedToggle = (suggested: string) => {
    const newSuggested = filters.suggested.includes(suggested)
      ? filters.suggested.filter((s) => s !== suggested)
      : [...filters.suggested, suggested];
    onFilterChange({
      ...filters,
      suggested: newSuggested,
    });
  };

  const handleFeaturesToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];
    onFilterChange({
      ...filters,
      features: newFeatures,
    });
  };

  const handleDietaryToggle = (dietary: string) => {
    const newDietary = filters.dietaryRestrictions.includes(dietary)
      ? filters.dietaryRestrictions.filter((d) => d !== dietary)
      : [...filters.dietaryRestrictions, dietary];
    onFilterChange({
      ...filters,
      dietaryRestrictions: newDietary,
    });
  };

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter((c) => c !== cuisine)
      : [...filters.cuisine, cuisine];
    onFilterChange({
      ...filters,
      cuisine: newCuisines,
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: rating,
    });
  };

  const handleDistanceChange = (distance: string) => {
    onFilterChange({
      ...filters,
      distance,
    });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: filters.searchQuery,
      location: filters.location,
      minRating: 0,
      priceRange: [],
      categories: [],
      cuisine: [],
      sortBy: 'rating',
      features: [],
      distance: '',
      suggested: [],
      dietaryRestrictions: [],
    });
  };

  const hasActiveFilters =
    filters.minRating > 0 ||
    filters.priceRange.length > 0 ||
    filters.categories.length > 0 ||
    filters.cuisine.length > 0 ||
    filters.features.length > 0 ||
    filters.distance !== '' ||
    filters.suggested.length > 0 ||
    filters.dietaryRestrictions.length > 0;

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 lg:sticky lg:top-16">
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Sort By */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Sort By</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.sort && (
            <div className="space-y-2">
              {[
                { value: 'rating', label: 'Highest Rated' },
                { value: 'reviews', label: 'Most Reviews' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'deliveryTime', label: 'Fastest Delivery' },
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range - Segmented Buttons */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Price</h3>
          {expandedSections.price && (
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              {['$', '$$', '$$$', '$$$$'].map((price, index) => (
                <button
                  key={price}
                  onClick={() => handlePriceRangeToggle(price)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    filters.priceRange.includes(price)
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  } ${index !== 0 ? 'border-l' : ''}`}
                >
                  {price}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Suggested */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('suggested')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Suggested</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.suggested ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.suggested && (
            <div className="space-y-2">
              {[
                { value: 'openNow', label: `Open now ${getCurrentTime()}` },
                { value: 'offersDelivery', label: 'Offers delivery' },
                { value: 'takeawayAvailable', label: 'Takeaway available' },
                { value: 'suitableForDinner', label: 'Suitable for dinner' },
                { value: 'newAndTrendy', label: 'New and trendy' },
                { value: 'terrace', label: 'Terrace' },
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.suggested.includes(option.value)}
                    onChange={() => handleSuggestedToggle(option.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Features</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.features ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.features && (
            <div className="space-y-2">
              {[
                { value: 'suitableForLunch', label: 'Suitable for lunch' },
                { value: 'suitableForChildren', label: 'Suitable for children' },
                { value: 'suitableForGroups', label: 'Suitable for groups' },
                { value: 'dogsAllowed', label: 'Dogs allowed' },
                { value: 'fullBar', label: 'Full bar' },
                { value: 'suitableForBrunch', label: 'Suitable for brunch' },
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(option.value)}
                    onChange={() => handleFeaturesToggle(option.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
              <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                View all
              </button>
            </div>
          )}
        </div>

        {/* Dietary Restrictions - Pill Buttons */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Dietary Restrictions</h3>
          {expandedSections.dietary && (
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'halal', label: 'Halal' },
                { value: 'vegan', label: 'Vegan' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'kosher', label: 'Kosher' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDietaryToggle(option.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
                    filters.dietaryRestrictions.includes(option.value)
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Distance */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('distance')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Distance</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.distance ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.distance && (
            <div className="space-y-2">
              {[
                { value: 'asTheCrowFlies', label: 'As the crow flies' },
                { value: 'byCar', label: 'By car (8 km)' },
                { value: 'byBike', label: 'By bike (4 km)' },
                { value: 'onFoot', label: 'On foot (2 km)' },
                { value: 'within500m', label: 'Within 500 m' },
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="distance"
                    checked={filters.distance === option.value}
                    onChange={() => handleDistanceChange(option.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Minimum Rating</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0, 0].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center">
                    {rating > 0 ? (
                      <>
                        {rating}+ ⭐
                        <span className="ml-1 text-gray-500">({rating} stars & up)</span>
                      </>
                    ) : (
                      'Any Rating'
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cuisine Type */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('cuisine')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Cuisine Type</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.cuisine ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.cuisine && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cuisines.map((cuisine) => (
                <label key={cuisine} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.cuisine.includes(cuisine)}
                    onChange={() => handleCuisineToggle(cuisine)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{cuisine}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories - Pill Buttons */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>Category</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
                      filters.categories.includes(category)
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {categories.length > 6 && (
                <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                  View all
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
