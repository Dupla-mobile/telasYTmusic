import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          placeholder="Músicas, artistas, álbuns"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
        />
      </View>
      <Text style={styles.hint}>Digite algo para começar a buscar</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  hint: {
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
});
