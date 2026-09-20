import { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { SONGS } from "../data/mockData";
import SongItem from "../components/SongItem";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SONGS.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          placeholder="Músicas, artistas, álbuns"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {query.trim() === "" ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.hint}>Digite algo para começar a buscar</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.hint}>Nenhum resultado para "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => <SongItem song={item} onPress={() => navigation.navigate("Player")} />}
        />
      )}
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
  emptyState: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  hint: {
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    textAlign: "center",
  },
});
