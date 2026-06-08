import { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { i18n } from "../../contexts/LanguageContext";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { Rol, ROLES, ROL_LABELS } from "../../utils/types/Recoleccion";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("residente");

  const { login } = useAuth();
  const { colors } = useTheme();

  const handleLogin = () => {
    try {
      const allowed = login(email, rol);
      if (allowed) {
        // segun el rol elegido se entra a una de las dos secciones
        navigation.reset({
          index: 0,
          routes: [
            { name: rol === "residente" ? "ResidenteTabs" : "RecolectorTabs" },
          ],
        });
      } else {
        console.log("Correo inválido");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <SectionTitle
        title="EcoRuta"
        subtitle="Recolección de basura para un pueblo más limpio"
      />

      <CustomInput
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={setEmail}
      />
      <CustomInput
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={setPassword}
      />

      <Text style={[styles.label, { color: colors.primary }]}>
        Ingresar como
      </Text>
      <View style={styles.rolRow}>
        {ROLES.map((r) => (
          <CustomButton
            key={r}
            title={ROL_LABELS[r]}
            onPress={() => setRol(r)}
            variant={rol === r ? "primary" : "tertiary"}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <CustomButton
          title={i18n.t("signIn")}
          onPress={handleLogin}
          style={styles.fullButton}
        />
        <CustomButton
          title={i18n.t("register")}
          onPress={() => navigation.navigate("Register")}
          variant="secondary"
          style={styles.fullButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  rolRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  fullButton: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 14,
  },
});
