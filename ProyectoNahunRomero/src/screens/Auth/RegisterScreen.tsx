

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("residente");

  const { login } = useAuth();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const handleRegister = () => {
    const allowed = login(email, rol);
    if (!allowed) {
      console.log("Correo inválido");
      return;
    }
    // guarda los datos basicos del perfil en redux
    dispatch(updateProfile({ nombre, telefono, rol }));
    navigation.reset({
      index: 0,
      routes: [{ name: rol === "residente" ? "ResidenteTabs" : "RecolectorTabs" }],
    });
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
        <CustomButton title="Registrarme" onPress={handleRegister} />
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
