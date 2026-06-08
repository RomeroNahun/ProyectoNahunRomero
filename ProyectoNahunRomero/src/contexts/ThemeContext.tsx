import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeColors } from "../utils/types/ThemeColors";

type ThemeMode = "light" | "dark";

// Tema claro: base blanca con verdes
const lightColors: ThemeColors = {
  background: "#ffffff",
  text: "#14241a",
  textSecondary: "#5a6b5f",
  primary: "#15803d",
  secondary: "#16a34a",
  inputBackground: "#f0f5f1",
  buttonPrimaryBg: "#16a34a",
  buttonPrimaryText: "#ffffff",
  buttonSecondaryBg: "#9ca3af",
  buttonSecondaryText: "#ffffff",
  buttonTertiaryBg: "#e6efe8",
  buttonTertiaryText: "#14241a",
  onSecondary: "#ffffff",
  tabBarBackground: "#ffffff",
  headerBackground: "#ffffff",
  headerText: "#15803d",
  error: "#d32f2f",
  border: "#cdd8d0",
};

// Tema oscuro: negro con verde (paleta principal de la app)
const darkColors: ThemeColors = {
  background: "#0a0f0b",
  text: "#e6f4ea",
  textSecondary: "#8aa092",
  primary: "#4ade80",
  secondary: "#22c55e",
  inputBackground: "#13201a",
  buttonPrimaryBg: "#16a34a",
  buttonPrimaryText: "#ffffff",
  buttonSecondaryBg: "#2c4133",
  buttonSecondaryText: "#e6f4ea",
  buttonTertiaryBg: "#13201a",
  buttonTertiaryText: "#e6f4ea",
  onSecondary: "#0a0f0b",
  tabBarBackground: "#0d140f",
  headerBackground: "#0d140f",
  headerText: "#4ade80",
  error: "#f87171",
  border: "#23362b",
};

type ThemeContextType = {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // arranca en modo oscuro (verde + negro)
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const colors = theme === "dark" ? darkColors : lightColors;
  const isDark = theme === "dark";

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
