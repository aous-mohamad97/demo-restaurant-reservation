import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon in Vite/bundled apps (Leaflet expects images at a path that may not resolve)
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

interface RestaurantMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  height?: string;
  zoom?: number;
}

/** Centers the map when latitude/longitude change (e.g. restaurant change). */
function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  latitude,
  longitude,
  name,
  address,
  height = '240px',
  zoom = 15,
}) => {
  const position: [number, number] = useMemo(() => [latitude, longitude], [latitude, longitude]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100" style={{ height }}>
      <MapContainer
        center={position}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <MapCenter lat={latitude} lng={longitude} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>{name}</strong>
            {address && <div className="text-sm text-gray-600 mt-1">{address}</div>}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;
