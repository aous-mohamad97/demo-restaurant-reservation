import { useLanguage } from '../context/LanguageContext';
import { translations } from './translations';

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

export function useTranslations() {
  const { lang } = useLanguage();
  const dict = translations[lang];

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = getNested(dict as Record<string, unknown>, key);
    if (typeof value !== 'string') value = key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = (value as string).replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
      });
    }
    return value as string;
  };

  return { t };
}
