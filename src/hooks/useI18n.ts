import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
    },
    [i18n]
  );

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  const isLanguage = useCallback(
    (lng: string) => {
      return i18n.language === lng;
    },
    [i18n]
  );

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    isLanguage,
  };
};

export const useCommonTranslation = () => {
  const { t } = useTranslation();
  return t;
};
