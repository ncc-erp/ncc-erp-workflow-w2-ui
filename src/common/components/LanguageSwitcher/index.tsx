import React from 'react';
import { Select, Box } from '@chakra-ui/react';

import { useI18n } from './../../../hooks/useI18n';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { changeLanguage, getCurrentLanguage } = useI18n();
  const { t } = useTranslation();

  const languages = [
    {
      code: 'vi',
      flag: '🇻🇳',
      name: t('LANGUAGE_SWITCHER.VIETNAM'),
    },
    {
      code: 'en',
      flag: '🇺🇸',
      name: t('LANGUAGE_SWITCHER.ENGLISH'),
    },
  ];

  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLanguage = event.target.value;
    changeLanguage(selectedLanguage);
  };

  return (
    <Box
      style={{
        marginRight: '16px',
      }}
    >
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        width={150}
        variant="outline"
        size="sm"
        borderRadius="md"
        fontSize="sm"
        _hover={{
          borderColor: 'blue.300',
        }}
        _focus={{
          borderColor: 'blue.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
        }}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};
