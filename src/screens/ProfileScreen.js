import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Perfil</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
  },
});
