import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Load translation files from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },

    // Namespaces
    ns: ['common', 'hse', 'auth', 'navigation'],
    defaultNS: 'common',

    // Resources for initial load (optional fallback)
    resources: {
      en: {
        common: {
          welcome: 'Welcome',
          loading: 'Loading...',
          save: 'Save',
          cancel: 'Cancel',
          edit: 'Edit',
          delete: 'Delete',
          create: 'Create',
          update: 'Update',
          search: 'Search',
          filter: 'Filter',
          export: 'Export',
          import: 'Import',
          submit: 'Submit',
          reset: 'Reset',
          close: 'Close',
          confirm: 'Confirm',
          yes: 'Yes',
          no: 'No',
          ok: 'OK',
          error: 'Error',
          success: 'Success',
          warning: 'Warning',
          info: 'Information',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: 'HH:mm',
          dateTimeFormat: 'MM/DD/YYYY HH:mm',
        },
      },
      id: {
        common: {
          welcome: 'Selamat Datang',
          loading: 'Memuat...',
          save: 'Simpan',
          cancel: 'Batal',
          edit: 'Ubah',
          delete: 'Hapus',
          create: 'Buat',
          update: 'Perbarui',
          search: 'Cari',
          filter: 'Saring',
          export: 'Ekspor',
          import: 'Impor',
          submit: 'Kirim',
          reset: 'Reset',
          close: 'Tutup',
          confirm: 'Konfirmasi',
          yes: 'Ya',
          no: 'Tidak',
          ok: 'OK',
          error: 'Kesalahan',
          success: 'Berhasil',
          warning: 'Peringatan',
          info: 'Informasi',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm',
          dateTimeFormat: 'DD/MM/YYYY HH:mm',
        },
      },
    },
  });

export default i18n;