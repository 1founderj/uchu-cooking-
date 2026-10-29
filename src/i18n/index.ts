import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esCommon from "@/locales/es/common.json";
import esHome from "@/locales/es/home.json";
import esFaq from "@/locales/es/faq.json";
import esSeo from "@/locales/es/seo.json";

// Add a language: copy /src/locales/es/* into /src/locales/<code>/, import below, add the code here.
export const SUPPORTED_LANGS = ["es"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export const resources = {
  es: { common: esCommon, home: esHome, faq: esFaq, seo: esSeo },
} as const;

export function isLang(v: string | undefined): v is Lang {
  return !!v && (SUPPORTED_LANGS as readonly string[]).includes(v);
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: [...SUPPORTED_LANGS],
    ns: ["common", "home", "faq", "seo"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
