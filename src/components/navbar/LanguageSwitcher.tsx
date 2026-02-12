import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={`flex items-center rounded-lg border border-gray-200 overflow-hidden text-xs sm:text-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 ${lang === 'en' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={`px-2 py-1 ${lang === 'ar' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
