import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { SONGS } from "../data/mockData";

export default function MiniPlayer() {
  const navigation = useNavigation();
  const song = SONGS[0];

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("Player")} activeOpacity={0.9}>
      <View style={[styles.thumb, { backgroundColor: song.color }]}>
        <Ionicons name="musical-notes" size={16} color="#fff" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
      </View>
      <TouchableOpacity hitSlop={10} style={{ marginRight: SPACING.sm }}>
        <Ionicons name="play" size={22} color={COLORS.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    marginHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm - 1,
  },
});
