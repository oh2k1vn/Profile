import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Import file JSON thủ công hoặc dùng backend plugin để load dynamic
import enJSON from '@/locales/en/translation.json'
import viJSON from '@/locales/vi/translation.json'

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next) // Kết nối với React
  .init({
    resources: {
      en: { translation: enJSON },
      vi: { translation: viJSON },
    },
    fallbackLng: 'en', // Nếu không tìm thấy ngôn ngữ, quay về Eng
    interpolation: {
      escapeValue: false, // React đã tự xử lý XSS nên không cần
    },
  })

export default i18n
