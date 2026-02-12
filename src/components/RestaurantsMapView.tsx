import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import type { Restaurant } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../i18n';
import {
  getRestaurantName,
  getRestaurantLocation,
  getRestaurantDealText,
  restaurantHasDeal,
} from '../utils/restaurant';
import { formatPriceRange } from '../constants/restaurant';

// Fix default marker icon in bundled apps (same as details page map)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEAL_ICON_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const DealIcon = L.icon({
  iconUrl: DEAL_ICON_URL,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'deal-marker-icon',
});

interface RestaurantsMapViewProps {
  restaurants: Restaurant[];
  yourLocationLabel: string;
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions as [number, number][]);
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, positions]);
  return null;
}

function RestaurantMarker({
  restaurant,
  lang,
  t,
}: {
  restaurant: Restaurant;
  lang: 'en' | 'ar';
  t: (key: string) => string;
}) {
  const lat = restaurant.latitude;
  const lng = restaurant.longitude;
  const hasDeal = restaurantHasDeal(restaurant);

  if (lat == null || lng == null) return null;

  return (
    <Marker
      position={[lat, lng]}
      icon={hasDeal ? DealIcon : DefaultIcon}
      eventHandlers={{
        mouseover: (e) => {
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.closePopup();
        },
      }}
    >
      <Popup className="restaurant-map-popup" minWidth={260} closeButton>
        <div className="text-left">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link
              to={`/restaurants/${restaurant.id}`}
              className="font-bold text-gray-900 hover:text-orange-600 transition-colors text-base"
            >
              {getRestaurantName(restaurant, lang)}
            </Link>
            <span className="text-sm font-semibold text-gray-600 shrink-0">
              {formatPriceRange(restaurant.priceRange)}
            </span>
          </div>
          {hasDeal && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500 text-white mb-2">
              {t('filters.deals')}
            </span>
          )}
          {getRestaurantDealText(restaurant, lang) && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
              {getRestaurantDealText(restaurant, lang)}
            </p>
          )}
          <div className="flex items-center text-gray-600 text-xs mb-1">
            <svg className="w-3 h-3 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{getRestaurantLocation(restaurant, lang)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-700 mb-2">
            <span className="font-medium">{restaurant.rating}</span>
            <span className="mx-1">★</span>
            <span className="text-gray-500">
              ({restaurant.reviewCount.toLocaleString()} {t('restaurant.reviews')})
            </span>
          </div>
          {restaurant.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {restaurant.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

const RestaurantsMapView: React.FC<RestaurantsMapViewProps> = ({
  restaurants,
  yourLocationLabel,
}) => {
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  const withCoords = useMemo(
    () => restaurants.filter((r) => r.latitude != null && r.longitude != null),
    [restaurants]
  );

  const allPositions = useMemo(() => {
    const pos: [number, number][] = withCoords.map((r) => [r.latitude!, r.longitude!]);
    if (userPos) pos.push(userPos);
    return pos;
  }, [withCoords, userPos]);

  const defaultCenter: [number, number] =
    withCoords.length > 0
      ? [withCoords[0].latitude!, withCoords[0].longitude!]
      : [33.5138, 36.2765];

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  return (
    <div
      className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
      style={{ height: '70vh' }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <FitBounds positions={allPositions} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPos && (
          <CircleMarker
            center={userPos}
            radius={10}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#2563eb',
              fillOpacity: 0.8,
              weight: 2,
            }}
          >
            <Popup>{yourLocationLabel}</Popup>
          </CircleMarker>
        )}
        {withCoords.map((restaurant) => (
          <RestaurantMarker
            key={restaurant.id}
            restaurant={restaurant}
            lang={lang}
            t={t}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantsMapView;
