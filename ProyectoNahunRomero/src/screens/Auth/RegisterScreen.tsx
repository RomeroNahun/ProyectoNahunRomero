import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { Rol, ROLES, ROL_LABELS } from "../../utils/types/Recoleccion";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("residente");
  const [cargando, setCargando] = useState(false);

  const { register } = useAuth();
  const { colors } = useTheme();
//Validacion, que todos los datos esten ingresados en el Formulario de Registro
  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !telefono.trim() || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    setCargando(true);
    const res = await register({
      email: email.trim(),
      password,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      rol,
    });
    setCargando(false);

    if (res.error) {
      Alert.alert("Error de registro", res.error);
      return;
    }

    // si Supabase pide confirmar el correo, no hay sesion todavia
    if (res.needsConfirmation) {
      Alert.alert(
        "¡Casi listo!",
        "Revisa tu correo para confirmar la cuenta y luego inicia sesión.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      );
      return;
    }

    // con sesion creada, el AuthContext setea el user y el navegador
    // cambia solo a los tabs del rol correspondiente
  };

  return (
    <ScreenWrapper>
      <SectionTitle title="Crear cuenta" subtitle="Regístrate para empezar" />

      <CustomInput placeholder="Nombre completo" value={nombre} onChange={setNombre} />
      <CustomInput type="email" placeholder="Correo" value={email} onChange={setEmail} />
      <CustomInput
        type="number"
        placeholder="Teléfono"
        value={telefono}
        onChange={setTelefono}
      />
      <CustomInput
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={setPassword}
      />

      <Text style={[styles.label, { color: colors.primary }]}>Soy</Text>
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
          title={cargando ? "Creando cuenta..." : "Registrarme"}
          onPress={handleRegister}
        />
        <CustomButton
          title="Ya tengo cuenta"
          onPress={() => navigation.goBack()}
          variant="tertiary"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
});
