import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar, LocationDropdown, LanguageSwitcher, AuthButtons } from './navbar/index';

interface NavbarProps {
  searchQuery: string;
  location: string;
  onSearchChange: (query: string) => void;
  onLocationChange: (location: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  location,
  onSearchChange,
  onLocationChange,
}) => (
  <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Layout */}
      <div className="flex lg:hidden justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-orange-600">🍽️</span>
          <span className="text-lg font-bold text-gray-800">7 Jaztelak</span>
        </Link>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <AuthButtons size="sm" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-orange-600">🍽️</span>
          <span className="text-xl font-bold text-gray-800">7 Jaztelak</span>
        </Link>

        <div className="flex-1 max-w-2xl mx-8">
          <SearchBar value={searchQuery} onChange={onSearchChange} size="md" />
        </div>

        <LocationDropdown
          currentLocation={location}
          onSelect={onLocationChange}
          variant="desktop"
        />

        <div className="flex items-center space-x-4 ml-4">
          <LanguageSwitcher className="hidden md:flex mr-2" />
          <AuthButtons size="md" />
        </div>
      </div>

      {/* Mobile Search + Location */}
      <div className="lg:hidden pb-3">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          size="sm"
          className="mb-2"
        />
        <LocationDropdown
          currentLocation={location}
          onSelect={onLocationChange}
          variant="mobile"
        />
      </div>
    </div>
  </nav>
);

export default Navbar;
