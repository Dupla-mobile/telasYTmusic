import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { PLAYLISTS, ALBUMS } from "../data/mockData";

function Row({ title, subtitle, color, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowArt, { backgroundColor: color }]}>
        <Ionicons name="musical-notes" size={22} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

export default function LibraryScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Biblioteca</Text>

        <Row
          title="Músicas curtidas"
          subtitle="Sua coleção pessoal"
          color={COLORS.primary}
          onPress={() => navigation.navigate("PlaylistDetail")}
        />

        <Text style={styles.sectionTitle}>Playlists</Text>
        {PLAYLISTS.map((p) => (
          <Row key={p.id} title={p.title} subtitle={p.subtitle} color={p.color} onPress={() => navigation.navigate("PlaylistDetail")} />
        ))}

        <Text style={styles.sectionTitle}>Álbuns</Text>
        {ALBUMS.map((a) => (
          <Row key={a.id} title={a.title} subtitle={a.artist} color={a.color} onPress={() => navigation.navigate("PlaylistDetail")} />
        ))}
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
    paddingBottom: SPACING.xl,
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
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  rowArt: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  rowTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
});
