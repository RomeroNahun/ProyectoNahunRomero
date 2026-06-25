import { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useAuth } from "../../contexts/AuthContext";
import { i18n } from "../../contexts/LanguageContext";
import { RootStackParamList } from "../../navigation/StackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Ingresa tu correo y contraseña");
      return;
    }
    setCargando(true);
    const res = await login(email.trim(), password);
    setCargando(false);

    if (res.error) {
      Alert.alert("No se pudo iniciar sesión", res.error);
      return;
    }
    // al iniciar sesion el AuthContext setea el user y el navegador
    // cambia solo a los tabs del rol correspondiente
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

      <View style={styles.actions}>
        <CustomButton
          title={cargando ? "Ingresando..." : i18n.t("signIn")}
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
