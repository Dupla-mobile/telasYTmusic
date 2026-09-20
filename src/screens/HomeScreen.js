import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { SONGS, PLAYLISTS, ALBUMS } from "../data/mockData";

function Card({ title, subtitle, color, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardArt, { backgroundColor: color }]}>
        <Ionicons name="musical-notes" size={28} color="#fff" />
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.header}>Início</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={30} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Ouça de novo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {SONGS.slice(0, 5).map((s) => (
            <Card key={s.id} title={s.title} subtitle={s.artist} color={s.color} onPress={() => navigation.navigate("Player")} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Feito para você</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {PLAYLISTS.map((p) => (
            <Card key={p.id} title={p.title} subtitle={p.subtitle} color={p.color} onPress={() => navigation.navigate("PlaylistDetail")} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Novos lançamentos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {ALBUMS.map((a) => (
            <Card key={a.id} title={a.title} subtitle={a.artist} color={a.color} onPress={() => navigation.navigate("PlaylistDetail")} />
          ))}
        </ScrollView>
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
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  header: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  row: {
    paddingBottom: SPACING.lg,
  },
  card: {
    width: 130,
    marginRight: SPACING.md,
  },
  cardArt: {
    width: 130,
    height: 130,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
});
