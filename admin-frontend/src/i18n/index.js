import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './resources/en.json';

const resources = {
  en
};

i18next
.use(initReactI18next)
.init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18next;
