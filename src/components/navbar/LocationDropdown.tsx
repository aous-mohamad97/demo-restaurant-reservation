import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../i18n';
import { locations, locationsAr } from '../../data';

interface LocationDropdownProps {
  currentLocation: string;
  onSelect: (location: string) => void;
  variant?: 'desktop' | 'mobile';
}

export const LocationDropdown: React.FC<LocationDropdownProps> = ({
  currentLocation,
  onSelect,
  variant = 'desktop',
}) => {
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeIndex = locations.indexOf(currentLocation);
  const label =
    activeIndex > 0
      ? lang === 'ar'
        ? locationsAr[activeIndex] ?? locations[activeIndex]
        : locations[activeIndex]
      : currentLocation || t('nav.location');

  const isMobile = variant === 'mobile';
  const dropdownPosition = isMobile ? 'left-0 right-0' : 'right-0';
  const dropdownWidth = isMobile ? '' : 'w-56';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center space-x-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ${
          isMobile
            ? 'px-3 py-1.5 text-sm w-full justify-between'
            : 'px-4 py-2'
        }`}
      >
        <div className="flex items-center space-x-2">
          <svg
            className={isMobile ? 'h-4 w-4' : 'h-5 w-5'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={`text-sm font-medium ${!isMobile ? 'hidden xl:inline' : ''}`}>
            {label}
          </span>
        </div>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute ${dropdownPosition} mt-2 ${dropdownWidth} bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto`}
        >
          {locations.map((loc, idx) => {
            const optionLabel = lang === 'ar' ? locationsAr[idx] ?? loc : loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  onSelect(loc);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  currentLocation === loc ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                }`}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
