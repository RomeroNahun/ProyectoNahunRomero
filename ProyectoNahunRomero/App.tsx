import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import StackNavigator from "./src/navigation/StackNavigator";
import { navigationRef } from "./src/navigation/NavigationService";
import { AuthProvider } from "./src/contexts/AuthContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { store } from "./src/store";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Provider store={store}>
            <NavigationContainer ref={navigationRef}>
              <StackNavigator />
            </NavigationContainer>
          </Provider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
