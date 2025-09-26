import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Import translation files
import enTranslations from './locales/en.json'
import arTranslations from './locales/ar.json'
import frTranslations from './locales/fr.json'
import esTranslations from './locales/es.json'
import deTranslations from './locales/de.json'
import itTranslations from './locales/it.json'
import ptTranslations from './locales/pt.json'
import ruTranslations from './locales/ru.json'
import zhTranslations from './locales/zh.json'
import jaTranslations from './locales/ja.json'
import koTranslations from './locales/ko.json'
import hiTranslations from './locales/hi.json'
import trTranslations from './locales/tr.json'
import nlTranslations from './locales/nl.json'
import svTranslations from './locales/sv.json'
import noTranslations from './locales/no.json'
import daTranslations from './locales/da.json'
import fiTranslations from './locales/fi.json'
import plTranslations from './locales/pl.json'
import csTranslations from './locales/cs.json'
import huTranslations from './locales/hu.json'
import roTranslations from './locales/ro.json'
import bgTranslations from './locales/bg.json'
import hrTranslations from './locales/hr.json'
import skTranslations from './locales/sk.json'
import slTranslations from './locales/sl.json'
import etTranslations from './locales/et.json'
import lvTranslations from './locales/lv.json'
import ltTranslations from './locales/lt.json'
import elTranslations from './locales/el.json'
import heTranslations from './locales/he.json'
import faTranslations from './locales/fa.json'
import urTranslations from './locales/ur.json'
import thTranslations from './locales/th.json'
import viTranslations from './locales/vi.json'
import idTranslations from './locales/id.json'
import msTranslations from './locales/ms.json'
import tlTranslations from './locales/tl.json'
import swTranslations from './locales/sw.json'
import amTranslations from './locales/am.json'
import yoTranslations from './locales/yo.json'
import igTranslations from './locales/ig.json'
import haTranslations from './locales/ha.json'

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  },
  fr: {
    translation: frTranslations
  },
  es: {
    translation: esTranslations
  },
  de: {
    translation: deTranslations
  },
  it: {
    translation: itTranslations
  },
  pt: {
    translation: ptTranslations
  },
  ru: {
    translation: ruTranslations
  },
  zh: {
    translation: zhTranslations
  },
  ja: {
    translation: jaTranslations
  },
  ko: {
    translation: koTranslations
  },
  hi: {
    translation: hiTranslations
  },
  tr: {
    translation: trTranslations
  },
  nl: {
    translation: nlTranslations
  },
  sv: {
    translation: svTranslations
  },
  no: {
    translation: noTranslations
  },
  da: {
    translation: daTranslations
  },
  fi: {
    translation: fiTranslations
  },
  pl: {
    translation: plTranslations
  },
  cs: {
    translation: csTranslations
  },
  hu: {
    translation: huTranslations
  },
  ro: {
    translation: roTranslations
  },
  bg: {
    translation: bgTranslations
  },
  hr: {
    translation: hrTranslations
  },
  sk: {
    translation: skTranslations
  },
  sl: {
    translation: slTranslations
  },
  et: {
    translation: etTranslations
  },
  lv: {
    translation: lvTranslations
  },
  lt: {
    translation: ltTranslations
  },
  el: {
    translation: elTranslations
  },
  he: {
    translation: heTranslations
  },
  fa: {
    translation: faTranslations
  },
  ur: {
    translation: urTranslations
  },
  th: {
    translation: thTranslations
  },
  vi: {
    translation: viTranslations
  },
  id: {
    translation: idTranslations
  },
  ms: {
    translation: msTranslations
  },
  tl: {
    translation: tlTranslations
  },
  sw: {
    translation: swTranslations
  },
  am: {
    translation: amTranslations
  },
  yo: {
    translation: yoTranslations
  },
  ig: {
    translation: igTranslations
  },
  ha: {
    translation: haTranslations
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    
    // Ensure React integration works properly
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
    },
    
    // Remove backend since we're using inline resources
    // backend: {
    //   loadPath: '/locales/{{lng}}.json',
    // },
  })

export default i18n