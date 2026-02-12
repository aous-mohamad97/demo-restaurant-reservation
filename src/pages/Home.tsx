import React, { useState } from 'react';
import { restaurants } from '../data';
import RestaurantCard from '../components/RestaurantCard';
import FilterSidebar from '../components/FilterSidebar';
import Navbar from '../components/Navbar';
import RestaurantsMapView from '../components/RestaurantsMapView';
import { EmptyState, Button } from '../components/ui';
import { useRestaurantFilters } from '../hooks';
import { useTranslations } from '../i18n';

type ViewMode = 'list' | 'map';

const Home: React.FC = () => {
  const { t } = useTranslations();
  const { filters, setFilters, filteredRestaurants } = useRestaurantFilters(restaurants);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={filters.searchQuery}
        location={filters.location}
        onSearchChange={(query) => setFilters({ ...filters, searchQuery: query })}
        onLocationChange={(location) => setFilters({ ...filters, location })}
      />
      <div className="flex relative">
        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 z-50 lg:hidden">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>

        <main className="flex-1 p-4 sm:p-6 w-full lg:w-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {filteredRestaurants.length === 1
                      ? t('home.restaurantsFound')
                      : t('home.restaurantsFoundPlural', { count: filteredRestaurants.length })}
                  </h1>
                  {(filters.searchQuery ||
                    filters.location !== 'All Locations' ||
                    filters.minRating > 0 ||
                    filters.priceRange.length > 0 ||
                    filters.categories.length > 0 ||
                    filters.features.length > 0 ||
                    filters.distance !== '' ||
                    filters.suggested.length > 0 ||
                    filters.dietaryRestrictions.length > 0) && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t('home.showingFilters')}
                    </p>
                  )}
                </div>
                {/* Mobile Filter Button */}
                <Button
                variant="primary"
                size="md"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>{t('home.filtersButton')}</span>
              </Button>
              </div>
              {/* List / Map view toggle - only when there are results */}
              {filteredRestaurants.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-orange-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('home.showAsList')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'map'
                        ? 'bg-orange-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('home.showOnMap')}
                  </button>
                </div>
              )}
            </div>

            {filteredRestaurants.length === 0 ? (
              <EmptyState
                title={t('home.noRestaurants')}
                description={t('home.tryFilters')}
              />
            ) : viewMode === 'map' ? (
              <RestaurantsMapView
                restaurants={filteredRestaurants}
                yourLocationLabel={t('home.yourLocation')}
              />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onCategoryClick={(category) => {
                      setFilters((prev) => ({
                        ...prev,
                        categories: prev.categories.includes(category)
                          ? prev.categories
                          : [...prev.categories, category],
                      }));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
