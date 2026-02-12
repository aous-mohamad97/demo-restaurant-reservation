import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../i18n';
import type { ReservationActivity } from '../types';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
}

const PROFILE_STORAGE_KEY = 'customerProfile';
const RESERVATIONS_STORAGE_KEY = 'reservationActivities';

const loadProfile = (): ProfileData => {
  if (typeof window === 'undefined') {
    return { name: '', email: '', phone: '', city: '' };
  }
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { name: '', email: '', phone: '', city: '' };
    const parsed = JSON.parse(raw);
    return {
      name: parsed.name ?? '',
      email: parsed.email ?? '',
      phone: parsed.phone ?? '',
      city: parsed.city ?? '',
    };
  } catch {
    return { name: '', email: '', phone: '', city: '' };
  }
};

const loadReservations = (): ReservationActivity[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: ReservationActivity[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Profile: React.FC = () => {
  const { t } = useTranslations();
  const [profile, setProfile] = useState<ProfileData>(() => loadProfile());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const reservations = useMemo(() => loadReservations(), []);

  const totalReservations = reservations.length;
  const uniqueRestaurants = useMemo(
    () => new Set(reservations.map((r) => r.restaurantId)).size,
    [reservations]
  );
  const lastReservation = reservations[0] ?? null;

  useEffect(() => {
    if (!saveMessage) return;
    const id = setTimeout(() => setSaveMessage(null), 3000);
    return () => clearTimeout(id);
  }, [saveMessage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setSaveMessage(t('profile.saveSuccess'));
    } catch {
      // ignore storage errors in demo
    }
  };

  const formatDateTime = (iso: string | undefined) => {
    if (!iso) return '';
    try {
      const dt = new Date(iso);
      return dt.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {t('profile.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {t('profile.subtitle')}
            </p>
          </div>
          <Link
            to="/"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('profile.infoSectionTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.nameLabel')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.emailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.cityLabel')}
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  {t('profile.saveButton')}
                </button>
                {saveMessage && (
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                    {saveMessage}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('profile.activitySectionTitle')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="text-xs text-gray-500">
                  {t('profile.statsTotalReservations')}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {totalReservations}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="text-xs text-gray-500">
                  {t('profile.statsUniqueRestaurants')}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {uniqueRestaurants}
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">
                {t('profile.statsLastReservation')}
              </div>
              {lastReservation ? (
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 space-y-1">
                  <div className="font-semibold text-gray-900">
                    {lastReservation.restaurantName}
                  </div>
                  <div>
                    {t('profile.reservationAt')}{' '}
                    {formatDateTime(lastReservation.createdAt)}
                  </div>
                  <div>
                    {lastReservation.persons} {t('profile.persons')} • {lastReservation.time}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {t('profile.noReservations')}
                </p>
              )}
            </div>

            {reservations.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-gray-700">
                  Recent reservations
                </div>
                <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {reservations.slice(0, 10).map((r) => (
                    <li
                      key={r.id}
                      className="text-xs text-gray-700 border-b border-gray-100 pb-1 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {r.restaurantName}
                      </div>
                      <div className="text-gray-500">
                        {formatDateTime(r.createdAt)} • {r.persons} {t('profile.persons')}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

