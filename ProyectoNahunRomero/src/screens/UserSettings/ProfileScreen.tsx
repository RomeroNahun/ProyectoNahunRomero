import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateProfile } from "../../store/slices/userProfileSlice";
import { ROL_LABELS } from "../../utils/types/Recoleccion";


export default function ProfileScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.userProfile);
  const { colors } = useTheme();

  const [nombre, setNombre] = useState(userProfile.nombre);
  const [telefono, setTelefono] = useState(userProfile.telefono);
  const [direccion, setDireccion] = useState(userProfile.direccion);
  const [vehiculo, setVehiculo] = useState(userProfile.vehiculo);

  const esRecolector = userProfile.rol === "recolector";

  const handleSave = () => {
    dispatch(updateProfile({ nombre, telefono, direccion, vehiculo }));
  };

  return (
    <ScreenWrapper>
      <SectionTitle title="Mi perfil" subtitle="Información personal" />

      <View style={[styles.avatarSection, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
          <Text style={styles.avatarText}>
            {(userProfile.nombre || user?.email || "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.email, { color: colors.buttonTertiaryText }]}>
          {user?.email}
        </Text>
        <Text style={[styles.rol, { color: colors.secondary }]}>
          {ROL_LABELS[userProfile.rol]}
        </Text>
      </View>

      <SectionTitle title="Datos básicos" />
      <CustomInput placeholder="Nombre" value={nombre} onChange={setNombre} />
      <CustomInput type="number" placeholder="Teléfono" value={telefono} onChange={setTelefono} />
      <CustomInput placeholder="Dirección" value={direccion} onChange={setDireccion} />

      {esRecolector && (
        <>
          <Text style={[styles.label, { color: colors.primary }]}>Vehículo</Text>
          <CustomInput
            placeholder="Ej: Moto carga, Pickup..."
            value={vehiculo}
            onChange={setVehiculo}
          />
        </>
      )}

      <View style={styles.actions}>
        <CustomButton title="Guardar perfil" onPress={handleSave} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    padding: 20,
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
  email: {
    fontSize: 14,
  },
  rol: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 6,
  },
  actions: {
    marginTop: 12,
  },
});
