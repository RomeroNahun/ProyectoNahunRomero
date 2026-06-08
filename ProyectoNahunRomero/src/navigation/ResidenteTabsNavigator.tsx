import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/Residente/HomeScreen";
import ReportarBasuraScreen from "../screens/Residente/ReportarBasuraScreen";
import MisSolicitudesScreen from "../screens/Residente/MisSolicitudesScreen";
import ProfileScreen from "../screens/UserSettings/ProfileScreen";
import SettingsScreen from "../screens/UserSettings/SettingsScreen";
import { useTheme } from "../contexts/ThemeContext";

// 1. tipado de pantallas por pestaña
type ResidenteTabsParamList = {
  Inicio: undefined;
  Reportar: undefined;
  Solicitudes: undefined;
  Perfil: undefined;
  Configuracion: undefined;
};

// 2. crear el tab navigator
const Tab = createBottomTabNavigator<ResidenteTabsParamList>();

export type { ResidenteTabsParamList };

// 3. utilizar el tab navigator
export default function ResidenteTabsNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reportar"
        component={ReportarBasuraScreen}
        options={{
          title: "Reportar basura",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trash" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Solicitudes"
        component={MisSolicitudesScreen}
        options={{
          title: "Mis solicitudes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: "Mi perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Configuracion"
        component={SettingsScreen}
        options={{
          title: "Configuración",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
