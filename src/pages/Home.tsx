import React, { useMemo, useState } from 'react';
import { restaurants } from '../data/restaurants';
import { FilterState, Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import FilterSidebar from '../components/FilterSidebar';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const { lang } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    location: 'All Locations',
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredRestaurants = useMemo(() => {
    let filtered: Restaurant[] = [...restaurants];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.description.toLowerCase().includes(query) ||
          restaurant.location.toLowerCase().includes(query) ||
          restaurant.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Location filter
    if (filters.location && filters.location !== 'All Locations') {
      filtered = filtered.filter((restaurant) =>
        restaurant.location.includes(filters.location)
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((restaurant) => restaurant.rating >= filters.minRating);
    }

    // Price range filter
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter((restaurant) =>
        filters.priceRange.includes(restaurant.priceRange)
      );
    }

    // Cuisine filter
    if (filters.cuisine.length > 0) {
      filtered = filtered.filter((restaurant) =>
        filters.cuisine.includes(restaurant.cuisine)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((restaurant) =>
        restaurant.categories.some((cat) => filters.categories.includes(cat))
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter((restaurant) => {
        return filters.features.every((feature) => {
          switch (feature) {
            case 'suitableForLunch':
              return restaurant.suitableForLunch === true;
            case 'suitableForChildren':
              return restaurant.suitableForChildren === true;
            case 'suitableForGroups':
              return restaurant.suitableForGroups === true;
            case 'dogsAllowed':
              return restaurant.dogsAllowed === true;
            case 'fullBar':
              return restaurant.fullBar === true;
            case 'suitableForBrunch':
              return restaurant.suitableForBrunch === true;
            default:
              return true;
          }
        });
      });
    }

    // Suggested filter
    if (filters.suggested.length > 0) {
      filtered = filtered.filter((restaurant) => {
        return filters.suggested.every((suggested) => {
          switch (suggested) {
            case 'openNow':
              return restaurant.openNow === true;
            case 'offersDelivery':
              return restaurant.offersDelivery === true;
            case 'takeawayAvailable':
              return restaurant.takeawayAvailable === true;
            case 'suitableForDinner':
              return restaurant.suitableForDinner === true;
            case 'newAndTrendy':
              return restaurant.newAndTrendy === true;
            case 'terrace':
              return restaurant.terrace === true;
            default:
              return true;
          }
        });
      });
    }

    // Dietary Restrictions filter
    if (filters.dietaryRestrictions.length > 0) {
      filtered = filtered.filter((restaurant) => {
        return filters.dietaryRestrictions.some((dietary) => {
          switch (dietary) {
            case 'halal':
              return restaurant.halal === true;
            case 'vegan':
              return restaurant.vegan === true;
            case 'vegetarian':
              return restaurant.vegetarian === true;
            case 'kosher':
              return restaurant.kosher === true;
            default:
              return false;
          }
        });
      });
    }

    // Distance filter (for demo, we'll just keep all restaurants)
    // In a real app, this would filter based on actual distance calculations

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'deliveryTime':
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters]);

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
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {lang === 'ar'
                    ? `تم العثور على ${filteredRestaurants.length} مطعم`
                    : `${filteredRestaurants.length} Restaurant${
                        filteredRestaurants.length !== 1 ? 's' : ''
                      } Found`}
                </h1>
                {(filters.searchQuery ||
                  filters.location !== 'All Locations' ||
                  filters.minRating > 0 ||
                  filters.priceRange.length > 0 ||
                  filters.categories.length > 0 ||
                  filters.cuisine.length > 0 ||
                  filters.features.length > 0 ||
                  filters.distance !== '' ||
                  filters.suggested.length > 0 ||
                  filters.dietaryRestrictions.length > 0) && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    {lang === 'ar'
                      ? 'يتم عرض النتائج بناءً على عوامل التصفية الخاصة بك'
                      : 'Showing results based on your filters'}
                  </p>
                )}
              </div>
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {lang === 'ar' ? 'لم يتم العثور على مطاعم' : 'No restaurants found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {lang === 'ar'
                    ? 'حاول تعديل عوامل التصفية أو كلمات البحث.'
                    : 'Try adjusting your filters or search query.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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
