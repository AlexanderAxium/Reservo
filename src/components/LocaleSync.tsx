"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useEffect } from "react";

const LOCALE_TO_HTML_LANG: Record<string, string> = {
  es: "es",
  en: "en",
  pt: "pt",
};

/**
 * Componente que sincroniza el atributo lang del HTML con el locale actual.
 * Debe montarse dentro del body para poder acceder a document.documentElement.
 */
export function LocaleSync() {
  const { locale } = useTranslation("common");

  useEffect(() => {
    const htmlLang = LOCALE_TO_HTML_LANG[locale] ?? "es";
    document.documentElement.lang = htmlLang;
  }, [locale]);

  return null;
}
