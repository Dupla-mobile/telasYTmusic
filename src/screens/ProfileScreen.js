import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { USER } from "../data/mockData";

const OPTIONS = [
  { icon: "download-outline", label: "Downloads" },
  { icon: "time-outline", label: "Histórico de reprodução" },
  { icon: "notifications-outline", label: "Notificações" },
  { icon: "settings-outline", label: "Configurações" },
  { icon: "help-circle-outline", label: "Ajuda e feedback" },
];

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color="#fff" />
        </View>
        <Text style={styles.name}>{USER.name}</Text>
        <Text style={styles.email}>{USER.email}</Text>
        <View style={styles.badge}>
          <Ionicons name="star" size={14} color="#000" />
          <Text style={styles.badgeText}>{USER.plan}</Text>
        </View>
      </View>

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <TouchableOpacity key={opt.label} style={styles.option}>
            <Ionicons name={opt.icon} size={22} color={COLORS.text} />
            <Text style={styles.optionText}>{opt.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    padding: SPACING.md,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
  },
  email: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD93D",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginTop: SPACING.sm,
  },
  badgeText: {
    color: "#000",
    fontSize: FONT_SIZES.sm,
    fontWeight: "700",
    marginLeft: 4,
  },
  options: {
    paddingHorizontal: SPACING.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
});
