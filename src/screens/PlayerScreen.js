import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../constants/theme";

export default function PlayerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Tocando agora</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
  },
  header: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
  },
});
