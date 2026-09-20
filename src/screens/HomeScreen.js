import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Início</Text>
        <Text style={styles.sectionTitle}>Ouça de novo</Text>
        <Text style={styles.sectionTitle}>Feito para você</Text>
        <Text style={styles.sectionTitle}>Novos lançamentos</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
});
