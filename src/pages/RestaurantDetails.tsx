import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { restaurants, sampleReviews } from "../data";
import { useLanguage } from "../context/LanguageContext";
import ReservationDialog from "../components/ReservationDialog";
import { DEFAULT_OPENING_HOURS, formatPriceRange } from "../constants";
import { useTranslations } from "../i18n";
import { getRestaurantName, getRestaurantLocation, getRestaurantDescription, getRestaurantAddressLine1, getRestaurantAddressLine2 } from "../utils/restaurant";
import RestaurantMap from "../components/RestaurantMap";
import { ImageCarousel, StarRating, Button } from "../components/ui";

const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = useMemo(() => restaurants.find((r) => r.id === id), [id]);
  const [reviewSort, setReviewSort] = useState<
    "recent" | "rating_desc" | "rating_asc"
  >("recent");
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | null>(
    null
  );
  const [reviewSearch, setReviewSearch] = useState("");
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const [showReservation, setShowReservation] = useState(false);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("restaurant.notFound")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("restaurant.notFoundDescription")}
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            {t("restaurant.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const images =
    restaurant.images && restaurant.images.length > 0
      ? restaurant.images
      : [restaurant.image];
  const displayLocation = getRestaurantLocation(restaurant, lang);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    displayLocation
  )}`;
  const openingHours = restaurant.openingHours ?? DEFAULT_OPENING_HOURS;
  const addressLine2 = getRestaurantAddressLine2(restaurant, lang);

  const featureBadges = [
    restaurant.suitableForLunch && t("filters.featuresSuitableForLunch"),
    restaurant.suitableForChildren && t("filters.featuresSuitableForChildren"),
    restaurant.suitableForGroups && t("filters.featuresSuitableForGroups"),
    restaurant.dogsAllowed && t("filters.featuresDogsAllowed"),
    restaurant.fullBar && t("filters.featuresFullBar"),
    restaurant.suitableForBrunch && t("filters.featuresSuitableForBrunch"),
    restaurant.suitableForDinner && t("restaurant.badgeDinnerFriendly"),
  ].filter(Boolean) as string[];

  const suggestedBadges = [
    restaurant.openNow && t("filters.suggestedOpenNow"),
    restaurant.offersDelivery && t("filters.suggestedOffersDelivery"),
    restaurant.takeawayAvailable && t("filters.suggestedTakeawayAvailable"),
    restaurant.newAndTrendy && t("filters.suggestedNewAndTrendy"),
    restaurant.terrace && t("filters.suggestedTerrace"),
  ].filter(Boolean) as string[];

  const dietaryBadges = [
    restaurant.halal && t("filters.dietaryHalal"),
    restaurant.vegan && t("filters.dietaryVegan"),
    restaurant.vegetarian && t("filters.dietaryVegetarian"),
    restaurant.kosher && t("filters.dietaryKosher"),
  ].filter(Boolean) as string[];

  const amenities = [
    {
      label: t("restaurant.amenityAcceptsReservations"),
      icon: "calendar",
      enabled: restaurant.acceptsReservations ?? true,
    },
    {
      label: t("filters.suggestedOffersDelivery"),
      icon: "truck",
      enabled: restaurant.offersDelivery ?? true,
    },
    {
      label: t("restaurant.amenityAccessible"),
      icon: "access",
      enabled: restaurant.accessible ?? true,
    },
    {
      label: t("filters.suggestedTerrace"),
      icon: "terrace",
      enabled: restaurant.terrace ?? true,
    },
    {
      label: t("restaurant.amenityCasual"),
      icon: "casual",
      enabled: restaurant.casual ?? true,
    },
    {
      label: t("filters.featuresFullBar"),
      icon: "fullbar",
      enabled: restaurant.fullBar ?? true,
    },
    {
      label: t("restaurant.amenityHappyHour"),
      icon: "happyhour",
      enabled: restaurant.happyHour ?? true,
    },
    {
      label: t("restaurant.amenityTelevision"),
      icon: "tv",
      enabled: restaurant.television ?? true,
    },
    {
      label: t("restaurant.amenityWifi"),
      icon: "wifi",
      enabled: restaurant.wifi ?? true,
    },
    {
      label: t("restaurant.amenityDriveIn"),
      icon: "drivein",
      enabled: restaurant.driveIn ?? false,
    },
    {
      label: t("restaurant.amenityGreatForDinner"),
      icon: "dinner",
      enabled:
        restaurant.idealForDinner ?? restaurant.suitableForDinner ?? true,
    },
  ].filter((a) => a.enabled);

  const filteredReviews = useMemo(() => {
    let list = [...sampleReviews];

    // Rating filter
    if (reviewRatingFilter !== null) {
      list = list.filter((r) => r.rating === reviewRatingFilter);
    }

    // Text search (user name + review text)
    if (reviewSearch.trim()) {
      const q = reviewSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.userName.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      switch (reviewSort) {
        case "rating_desc":
          return b.rating - a.rating;
        case "rating_asc":
          return a.rating - b.rating;
        case "recent":
        default:
          // With dummy data, fall back to id order as recency proxy
          return b.id.localeCompare(a.id);
      }
    });

    return list;
  }, [reviewRatingFilter, reviewSearch, reviewSort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {getRestaurantName(restaurant, lang)}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center font-semibold text-gray-900">
                <StarRating rating={restaurant.rating} size="md" showValue />
              </span>
              <span className="text-gray-500">
                ({restaurant.reviewCount.toLocaleString()} reviews)
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {formatPriceRange(restaurant.priceRange)}
              </span>
              {restaurant.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" onClick={() => setShowReservation(true)}>
              {t("restaurant.bookTable")}
            </Button>
            <Link
              to="/"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">{t("restaurant.backToResults")}</span>
              <span className="sm:hidden">{t("restaurant.back")}</span>
            </Link>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <ImageCarousel images={images} alt={getRestaurantName(restaurant, lang)} variant="hero" />
        </div>

        {/* Location & Opening Hours */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("restaurant.locationHours")}
            </h2>
            {restaurant.closedNow && (
              <span className="text-sm font-semibold text-red-600">
                {t("restaurant.closedNow")}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              {restaurant.latitude != null && restaurant.longitude != null ? (
                <RestaurantMap
                  latitude={restaurant.latitude}
                  longitude={restaurant.longitude}
                  name={getRestaurantName(restaurant, lang)}
                  address={getRestaurantAddressLine1(restaurant, lang)}
                  height="240px"
                  zoom={15}
                />
              ) : (
                <div className="h-40 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-500 text-sm">
                  {t("restaurant.mapPreviewUnavailable")}
                </div>
              )}
              <div className="text-sm text-gray-800 leading-snug">
                <div className="font-semibold">{getRestaurantAddressLine1(restaurant, lang)}</div>
                {addressLine2 && <div>{addressLine2}</div>}
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-700 transition-colors"
                >
                  {t("restaurant.getDirections")}
                </a>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-800">
                {openingHours.map((oh) => (
                  <div
                    key={oh.day}
                    className="flex justify-between sm:justify-start sm:space-x-4"
                  >
                    <span className="font-medium text-gray-700 w-16">
                      {oh.day}
                    </span>
                    <span
                      className={`${
                        oh.isClosed ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {oh.isClosed ? t("restaurant.closed") : oh.hours}
                      {oh.note ? ` (${oh.note})` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Amenities and More */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("restaurant.amenities")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.label}
                className="flex items-center space-x-3 text-sm text-gray-800"
              >
                {amenity.icon === "calendar" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {amenity.icon === "truck" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h11v10H3zM14 10h4l3 3v4h-3m-4 0a2 2 0 104 0m-4 0H9m0 0a2 2 0 11-4 0m4 0V7"
                    />
                  </svg>
                )}
                {amenity.icon === "access" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5a2 2 0 100-4 2 2 0 000 4zm-2 6a2 2 0 114 0v8m-7-7h10m-9 7h8"
                    />
                  </svg>
                )}
                {amenity.icon === "terrace" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                )}
                {amenity.icon === "casual" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z"
                    />
                  </svg>
                )}
                {amenity.icon === "fullbar" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 3h12v4a6 6 0 11-12 0V3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 7h12M9 21h6"
                    />
                  </svg>
                )}
                {amenity.icon === "happyhour" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 22a10 10 0 110-20 10 10 0 010 20z"
                    />
                  </svg>
                )}
                {amenity.icon === "tv" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="12"
                      rx="2"
                      ry="2"
                      strokeWidth={2}
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 21h8"
                    />
                  </svg>
                )}
                {amenity.icon === "wifi" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12.55a11 11 0 0114.08 0M8.5 16a7 7 0 017 0M12 20h.01"
                    />
                  </svg>
                )}
                {amenity.icon === "drivein" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 11l1-4h8l1 4M5 11h10M5 11l-1 5h12l-1-5M7 16v2m6-2v2"
                    />
                  </svg>
                )}
                {amenity.icon === "dinner" && (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 3h16M4 7h16M10 11v8m4-8v8M4 21h16"
                    />
                  </svg>
                )}
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>
          {restaurant.additionalAttributesCount &&
            restaurant.additionalAttributesCount > 0 && (
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-700 transition-colors">
                {restaurant.additionalAttributesCount} {t("restaurant.additionalAttributes")}
              </button>
            )}
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-500">
              {t("restaurant.deliveryTime")}
            </div>
            <div className="text-base sm:text-lg font-semibold text-gray-900">
              {restaurant.deliveryTime}
            </div>
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {`${restaurant.deliveryFee.toFixed(2)} ${t("restaurant.deliveryFeeSuffix")}`}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-500">
              {t("restaurant.priceRange")}
            </div>
            <div className="text-base sm:text-lg font-semibold text-gray-900">
              {formatPriceRange(restaurant.priceRange)}
            </div>
          </div>
        </div>

        {/* Badges sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {featureBadges.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                {t("restaurant.features")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {featureBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestedBadges.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                {t("restaurant.suggested")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dietaryBadges.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 md:col-span-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                {t("restaurant.dietaryRestrictions")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {dietaryBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
            {t("restaurant.about")}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {getRestaurantDescription(restaurant, lang)}
          </p>
        </div>

        {/* Recommended Reviews */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4 mt-2 sm:mt-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("restaurant.recommendedReviews")}
          </h2>

          {/* Trust banner */}
          <div className="border border-blue-100 bg-blue-50 rounded-lg px-4 py-3 flex items-start space-x-3 text-sm text-gray-800">
            <div className="mt-0.5">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-semibold">{t("review.trustBanner")}</span>{" "}
              {t("review.trustBannerSuffix")}
              <button className="ml-1 text-blue-600 hover:underline font-medium">
                {t("review.learnMore")}
              </button>
            </div>
          </div>

          {/* Write review card */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {t("restaurant.startReview")} {getRestaurantName(restaurant, lang)}
                </div>
                <div className="flex items-center space-x-1 mt-1 text-gray-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.384 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.997 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
              {t("restaurant.writeReview")}
            </button>
          </div>

          {/* Rating breakdown & controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 sm:mt-4 items-start">
            {/* Overall rating */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900">
                {t("restaurant.overallRating")}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {restaurant.reviewCount.toLocaleString()} {t("restaurant.reviews")}
              </div>

              <div className="space-y-1 mt-2">
                {[5, 4, 3, 2, 1].map((stars, index) => {
                  const widths = [90, 40, 15, 8, 4];
                  return (
                    <div
                      key={stars}
                      className="flex items-center space-x-2 text-xs text-gray-600"
                    >
                      <span className="w-10">{stars} {t("restaurant.stars")}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{ width: `${widths[index]}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters & search */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white text-gray-700"
                  value={reviewSort}
                  onChange={(e) =>
                    setReviewSort(
                      e.target.value as "recent" | "rating_desc" | "rating_asc"
                    )
                  }
                >
                  <option value="recent">{t("restaurant.sortByRecent")}</option>
                  <option value="rating_desc">{t("restaurant.sortByHighest")}</option>
                  <option value="rating_asc">{t("restaurant.sortByLowest")}</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white text-gray-700">
                  <option>{t("review.languageEnglish")}</option>
                  <option>{t("review.languageAny")}</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white text-gray-700"
                  value={reviewRatingFilter ?? "all"}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviewRatingFilter(value === "all" ? null : Number(value));
                  }}
                >
                  <option value="all">{t("restaurant.filterByRating")}</option>
                  <option value="5">5 {t("restaurant.stars")}</option>
                  <option value="4">4 {t("restaurant.stars")}</option>
                  <option value="3">3 {t("restaurant.stars")}</option>
                  <option value="2">2 {t("restaurant.stars")}</option>
                  <option value="1">1 {t("restaurant.stars")}</option>
                </select>
              </div>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder={t("restaurant.searchWithinReviews")}
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Sample review cards */}
          <div className="mt-6 space-y-6">
            {filteredReviews.map((review) => {
              const reviewPhotos = review.photos ?? [];
              const reactions = [
                {
                  key: "helpful",
                  label: t("review.helpful"),
                  count: review.helpfulCount ?? 0,
                },
                {
                  key: "thanks",
                  label: t("review.thanks"),
                  count: review.thanksCount ?? 0,
                },
                {
                  key: "loveThis",
                  label: t("review.loveThis"),
                  count: review.loveThisCount ?? 0,
                },
                {
                  key: "ohNo",
                  label: t("review.ohNo"),
                  count: review.ohNoCount ?? 0,
                },
              ];
              return (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-semibold text-gray-900">
                            {review.userName}
                          </span>
                          {review.badge && (
                            <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              {review.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.userLocation}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                          <span>🍽 {review.reviewsCount} reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <StarRating rating={review.rating} size="sm" />
                      <div className="text-xs text-gray-500">{review.date}</div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                    {review.text}
                  </div>

                  {/* Photos */}
                  {reviewPhotos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {reviewPhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`${getRestaurantName(restaurant, lang)} review photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 mt-1">
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.key}
                        className="inline-flex items-center space-x-1 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:border-orange-400 hover:text-orange-700 transition-colors"
                      >
                        <span>{reaction.label}</span>
                        <span className="text-gray-400 text-[10px]">
                          {reaction.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ReservationDialog
        restaurant={restaurant}
        open={showReservation}
        onClose={() => setShowReservation(false)}
      />
    </div>
  );
};

export default RestaurantDetails;
