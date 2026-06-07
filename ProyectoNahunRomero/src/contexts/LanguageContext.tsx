import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../utils/translations";

type Language = "es" | "en" | "";

type LanguageContextType = {
  language: Language;
  changeLanguage: (lng: Language) => void;
  clearLanguage: () => void;
};

// 1. instancia de i18n con el diccionario cargado desde /utils
const i18n = new I18n(translations);

// 2. idioma por defecto y fallback habilitado
i18n.defaultLocale = "es";
i18n.enableFallback = true;

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("");

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("language");
      if (storedLanguage) {
        setLanguage(storedLanguage as Language);
        i18n.locale = storedLanguage;
      } else {
        i18n.locale = i18n.defaultLocale;
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lng: Language) => {
    setLanguage(lng);
    i18n.locale = lng;
    await AsyncStorage.setItem("language", lng);
  };

  const clearLanguage = async () => {
    await AsyncStorage.removeItem("language");
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, clearLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { i18n };
