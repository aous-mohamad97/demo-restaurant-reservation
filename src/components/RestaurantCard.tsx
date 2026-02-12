import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../i18n';
import { getRestaurantName, getRestaurantLocation, getRestaurantDescription, restaurantHasDeal, getRestaurantDealText } from '../utils/restaurant';
import { StarRating, ImageCarousel, Button } from './ui';
import ReservationDialog from './ReservationDialog';

interface RestaurantCardProps {
  restaurant: Restaurant;
  /** When provided, category pills become clickable and add the category to filters. */
  onCategoryClick?: (category: string) => void;
}

const imagesFromRestaurant = (restaurant: Restaurant): string[] =>
  restaurant.images?.length ? restaurant.images : [restaurant.image];

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onCategoryClick }) => {
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const [showReservation, setShowReservation] = useState(false);
  const images = imagesFromRestaurant(restaurant);

  return (
    <>
      <Link
        to={`/restaurants/${restaurant.id}`}
        className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <div className="flex flex-col sm:flex-row items-stretch">
          <div className="relative">
            <ImageCarousel images={images} alt={getRestaurantName(restaurant, lang)} variant="card" />
            {restaurantHasDeal(restaurant) && (
              <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-amber-500 text-white shadow-sm">
                {t('filters.deals')}
              </span>
            )}
          </div>

          <div className="flex-1 p-4 sm:p-6 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-orange-600 cursor-pointer transition-colors">
                  {getRestaurantName(restaurant, lang)}
                </h3>
                <span className="text-base sm:text-lg font-semibold text-gray-600">
                  {restaurant.priceRange}
                </span>
              </div>
              {getRestaurantDealText(restaurant, lang) && (
                <p className="text-xs sm:text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mb-2">
                  {getRestaurantDealText(restaurant, lang)}
                </p>
              )}

              <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{getRestaurantLocation(restaurant, lang)}</span>
              </div>

              <div className="flex items-center mb-3 flex-wrap gap-2">
                <StarRating rating={restaurant.rating} size="md" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {restaurant.rating}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  ({restaurant.reviewCount.toLocaleString()} {t('restaurant.reviews')})
                </span>
              </div>

              <p
                className="text-gray-600 text-xs sm:text-sm mb-4 overflow-hidden"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {getRestaurantDescription(restaurant, lang)}
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                {restaurant.categories.map((category) =>
                  onCategoryClick ? (
                    <button
                      key={category}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onCategoryClick(category);
                      }}
                      className="px-2 py-0.5 sm:py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors"
                    >
                      {category}
                    </button>
                  ) : (
                    <span
                      key={category}
                      className="px-2 py-0.5 sm:py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                    >
                      {category}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 gap-3 sm:gap-0">
              <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>
                    ${restaurant.deliveryFee.toFixed(2)} {t('restaurant.deliveryLabel')}
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowReservation(true);
                }}
              >
                {t('restaurant.bookNow')}
              </Button>
            </div>
          </div>
        </div>
      </Link>
      <ReservationDialog
        restaurant={restaurant}
        open={showReservation}
        onClose={() => setShowReservation(false)}
      />
    </>
  );
};

export default RestaurantCard;
