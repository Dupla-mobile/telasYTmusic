import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../constants/theme";

export default function PlaylistDetailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Detalhe da Playlist</Text>
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
