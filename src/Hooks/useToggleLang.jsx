import { useCallback } from "react";
import i18n from "i18next";

const useToggleLang = () => {
  return useCallback(() => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  }, []);
};

export default useToggleLang;
