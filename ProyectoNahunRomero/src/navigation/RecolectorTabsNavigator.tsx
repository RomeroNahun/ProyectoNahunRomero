import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SolicitudesPendientesScreen from "../screens/Recolector/SolicitudesPendientesScreen";
import RutasScreen from "../screens/Recolector/RutasScreen";
import ProfileScreen from "../screens/UserSettings/ProfileScreen";
import SettingsScreen from "../screens/UserSettings/SettingsScreen";
import { useTheme } from "../contexts/ThemeContext";

// 1. tipado de pantallas por pestaña
type RecolectorTabsParamList = {
  Pendientes: undefined;
  Rutas: undefined;
  Perfil: undefined;
  Configuracion: undefined;
};

// 2. crear el tab navigator
const Tab = createBottomTabNavigator<RecolectorTabsParamList>();

export type { RecolectorTabsParamList };

// 3. utilizar el tab navigator
export default function RecolectorTabsNavigator() {
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
        name="Pendientes"
        component={SolicitudesPendientesScreen}
        options={{
          title: "Pendientes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Rutas"
        component={RutasScreen}
        options={{
          title: "Rutas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
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
