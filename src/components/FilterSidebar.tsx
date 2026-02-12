import React, { useState } from 'react';
import { FilterState, FilterStateArrayKey } from '../types';
import { categories } from '../data';
import {
  DEFAULT_FILTER_STATE,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  SUGGESTED_OPTIONS,
  FEATURES_OPTIONS,
  DIETARY_OPTIONS,
  DISTANCE_OPTIONS,
  RATING_OPTIONS,
} from '../constants';
import { useTranslations } from '../i18n';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const { t } = useTranslations();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    sort: true,
    deals: true,
    price: true,
    rating: true,
    suggested: true,
    features: true,
    dietary: true,
    category: true,
    distance: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateArrayFilter = (field: FilterStateArrayKey, value: string) => {
    const current = filters[field] as string[];
    const next = current.includes(value)
      ? current.filter((x) => x !== value)
      : [...current, value];
    onFilterChange({ ...filters, [field]: next });
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
      ...DEFAULT_FILTER_STATE,
      searchQuery: filters.searchQuery,
      location: filters.location,
    });
  };

  const hasActiveFilters =
    filters.dealsOnly ||
    filters.minRating > 0 ||
    filters.priceRange.length > 0 ||
    filters.categories.length > 0 ||
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
          <h2 className="text-xl font-bold text-gray-900">
            {t('filters.title')}
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {t('filters.clearAll')}
            </button>
          )}
        </div>

        {/* Deals */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('deals')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>{t('filters.deals')}</span>
            <svg
              className={`h-4 w-4 transition-transform ${expandedSections.deals ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.deals && (
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.dealsOnly}
                onChange={() =>
                  onFilterChange({ ...filters, dealsOnly: !filters.dealsOnly })
                }
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{t('filters.dealsOnly')}</span>
            </label>
          )}
        </div>

        {/* Sort By */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>{t('filters.sortBy')}</span>
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
              {SORT_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t(option.key)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range - Segmented Buttons */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {t('filters.price')}
          </h3>
          {expandedSections.price && (
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              {PRICE_OPTIONS.map((price, index) => (
                <button
                  key={price}
                  onClick={() => updateArrayFilter('priceRange', price)}
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
            <span>{t('filters.suggested')}</span>
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
              {SUGGESTED_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.suggested.includes(option.value)}
                    onChange={() => updateArrayFilter('suggested', option.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.value === 'openNow'
                      ? `${t(option.key)} ${getCurrentTime()}`
                      : t(option.key)}
                  </span>
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
            <span>{t('filters.features')}</span>
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
              {FEATURES_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(option.value)}
                    onChange={() => updateArrayFilter('features', option.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t(option.key)}</span>
                </label>
              ))}
              <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                {t('filters.viewAll')}
              </button>
            </div>
          )}
        </div>

        {/* Dietary Restrictions - Pill Buttons */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {t('filters.dietary')}
          </h3>
          {expandedSections.dietary && (
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateArrayFilter('dietaryRestrictions', option.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
                    filters.dietaryRestrictions.includes(option.value)
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                  }`}
                >
                  {t(option.key)}
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
            <span>{t('filters.distance')}</span>
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
              {DISTANCE_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="distance"
                    checked={filters.distance === option.value}
                    onChange={() => handleDistanceChange(option.value)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t(option.key)}</span>
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
            <span>{t('filters.minRating')}</span>
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
              {RATING_OPTIONS.map((rating) => (
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
                        <span className="ml-1 text-gray-500">
                          ({rating} {t('filters.starsAndUp')})
                        </span>
                      </>
                    ) : (
                      t('filters.anyRating')
                    )}
                  </span>
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
            <span>{t('filters.category')}</span>
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
                    onClick={() => updateArrayFilter('categories', category)}
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
                  {t('filters.viewAll')}
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
