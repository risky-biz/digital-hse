import React from 'react';
import { useTranslation } from 'react-i18next';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilGlobeAlt } from '@coreui/icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: t('common:english'), flag: '🇺🇸' },
    { code: 'id', name: t('common:indonesian'), flag: '🇮🇩' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('digitalhse-language', languageCode);
  };

  return (
    <CDropdown variant="nav-item" className="d-flex align-items-center">
      <CDropdownToggle 
        caret={false} 
        className="border-0 bg-transparent"
        style={{ boxShadow: 'none' }}
      >
        <div className="d-flex align-items-center">
          <CIcon icon={cilGlobeAlt} size="lg" className="me-2" />
          <span className="me-1">{currentLanguage.flag}</span>
          <span className="d-none d-md-inline">{currentLanguage.name}</span>
        </div>
      </CDropdownToggle>
      <CDropdownMenu>
        {languages.map((language) => (
          <CDropdownItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={i18n.language === language.code ? 'active' : ''}
          >
            <span className="me-2">{language.flag}</span>
            {language.name}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default LanguageSwitcher;