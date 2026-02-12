import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../../i18n';

interface AuthButtonsProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ size = 'md', className = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const pad = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
  return (
    <div className={`flex items-center space-x-2 ${size === 'md' ? 'space-x-4' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className={`${pad} text-gray-700 hover:text-orange-600 font-medium transition-colors`}
      >
        {t('nav.login')}
      </button>
      <button
        type="button"
        onClick={() => navigate('/register')}
        className={`${pad} bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors`}
      >
        {t('nav.register')}
      </button>
    </div>
  );
};

export default AuthButtons;
