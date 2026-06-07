import { View, Text, StyleSheet, Switch } from "react-native";
import CustomButton from "../../components/CustomButton";


export default function SettingsScreen() {
  const { logout } = useAuth();
  const { changeLanguage, clearLanguage, language } = useLanguage();
  const { colors, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    logout();
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  return (
    <ScreenWrapper>
      <SectionTitle
        title="Configuración"
        subtitle="Personaliza tu experiencia en la app"
      />

      <View style={[styles.section, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          {i18n.t("changeLanguage")}
        </Text>
        <Text style={[styles.currentValue, { color: colors.textSecondary }]}>
          Idioma actual: {language || "es"}
        </Text>
        <View style={styles.buttonRow}>
          <CustomButton title="ES" onPress={() => changeLanguage("es")} />
          <CustomButton title="EN" onPress={() => changeLanguage("en")} variant="secondary" />
        </View>
        <CustomButton title="Limpiar idioma" onPress={clearLanguage} variant="tertiary" />
      </View>

      <View style={[styles.section, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>Apariencia</Text>
        <Text style={[styles.currentValue, { color: colors.textSecondary }]}>
          Tema actual: {isDark ? "Oscuro (verde + negro)" : "Claro"}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={colors.onSecondary}
          trackColor={{ true: colors.secondary, false: colors.border }}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>Sesión</Text>
        <CustomButton title="Cerrar sesión" onPress={handleLogout} variant="secondary" />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 13,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
});
