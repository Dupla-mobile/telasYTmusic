import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { SONGS } from "../data/mockData";
import SongItem from "../components/SongItem";

export default function PlaylistDetailScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <View style={styles.hero}>
        <View style={styles.art}>
          <Ionicons name="musical-notes" size={48} color="#fff" />
        </View>
        <Text style={styles.title}>Descoberta Semanal</Text>
        <Text style={styles.subtitle}>{SONGS.length} músicas</Text>

        <TouchableOpacity style={styles.playBtn} onPress={() => navigation.navigate("Player")}>
          <Ionicons name="play" size={20} color="#000" />
          <Text style={styles.playText}>Tocar tudo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SONGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} onPress={() => navigation.navigate("Player")} />}
      />
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
  hero: {
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  art: {
    width: 160,
    height: 160,
    borderRadius: RADIUS.md,
    backgroundColor: "#0984E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.text,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
  },
  playText: {
    color: "#000",
    fontWeight: "700",
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.md,
  },
});
