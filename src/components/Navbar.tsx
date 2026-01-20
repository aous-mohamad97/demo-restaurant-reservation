import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { locations, locationsAr } from '../data/restaurants';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  searchQuery: string;
  location: string;
  onSearchChange: (query: string) => void;
  onLocationChange: (location: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery, location, onSearchChange, onLocationChange }) => {
  const navigate = useNavigate();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeLocationIndex = locations.indexOf(location);
  const currentLocationLabel =
    activeLocationIndex > 0
      ? lang === 'ar'
        ? locationsAr[activeLocationIndex] ?? locations[activeLocationIndex]
        : locations[activeLocationIndex]
      : location || (lang === 'ar' ? 'الموقع' : 'Location');

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="flex lg:hidden justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-orange-600">🍽️</span>
            <span className="text-lg font-bold text-gray-800 hidden sm:inline">7 Jaztelak</span>
          </Link>
          <div className="flex items-center space-x-2">
            {/* Language picker */}
            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden text-xs sm:text-sm">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 ${lang === 'en' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 ${lang === 'ar' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
              >
                AR
              </button>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
            >
              Register
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">🍽️</span>
            <span className="text-xl font-bold text-gray-800">7 Jaztelak</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن المطاعم...' : 'Search restaurants...'}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium hidden xl:inline">
                {currentLocationLabel}
              </span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLocationDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
                {locations.map((loc, idx) => {
                  const label =
                    lang === 'ar' ? locationsAr[idx] ?? loc : loc;
                  return (
                  <button
                    key={loc}
                    onClick={() => {
                      onLocationChange(loc);
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      location === loc ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                );})}
              </div>
            )}
          </div>

          {/* Login/Register Buttons */}
          <div className="flex items-center space-x-4 ml-4">
            {/* Language picker */}
            <div className="hidden md:flex items-center rounded-lg border border-gray-200 overflow-hidden text-xs sm:text-sm mr-2">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 ${lang === 'en' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 ${lang === 'ar' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
              >
                AR
              </button>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
            >
              {lang === 'ar' ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <input
              type="text"
                placeholder={lang === 'ar' ? 'ابحث عن المطاعم...' : 'Search restaurants...'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="relative mt-2" ref={dropdownRef}>
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full justify-between"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">
                  {currentLocationLabel}
                </span>
              </div>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
                {locations.map((loc, idx) => {
                  const label =
                    lang === 'ar' ? locationsAr[idx] ?? loc : loc;
                  return (
                  <button
                    key={loc}
                    onClick={() => {
                      onLocationChange(loc);
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      location === loc ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                );})}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
