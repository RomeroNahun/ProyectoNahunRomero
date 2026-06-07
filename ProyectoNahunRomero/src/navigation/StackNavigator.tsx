import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ResidenteTabsNavigator from "./ResidenteTabsNavigator";
import RecolectorTabsNavigator from "./RecolectorTabsNavigator";
import ProgramarRecoleccionScreen from "../screens/Residente/ProgramarRecoleccionScreen";
import DetalleSolicitudScreen from "../screens/Residente/DetalleSolicitudScreen";
import DetalleRutaScreen from "../screens/Recolector/DetalleRutaScreen";
import { useTheme } from "../contexts/ThemeContext";

// 1. tipado de pantallas y sus parametros
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ResidenteTabs: undefined;
  RecolectorTabs: undefined;
  ProgramarRecoleccion: undefined;
  DetalleSolicitud: { solicitudId: string };
  DetalleRuta: { rutaId: string };
};

// 2. crear el stack navigator que maneja la navegacion
const Stack = createNativeStackNavigator<RootStackParamList>();

// 3. utilizar el stack
export default function StackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "EcoRuta" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Crear cuenta" }}
      />
      <Stack.Screen
        name="ResidenteTabs"
        component={ResidenteTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecolectorTabs"
        component={RecolectorTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProgramarRecoleccion"
        component={ProgramarRecoleccionScreen}
        options={{ title: "Programar recolección" }}
      />
      <Stack.Screen
        name="DetalleSolicitud"
        component={DetalleSolicitudScreen}
        options={{ title: "Detalle de solicitud" }}
      />
      <Stack.Screen
        name="DetalleRuta"
        component={DetalleRutaScreen}
        options={{ title: "Detalle de ruta" }}
      />
    </Stack.Navigator>
  );
}
