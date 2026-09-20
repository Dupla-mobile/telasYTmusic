import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES, RADIUS } from "../constants/theme";
import { SONGS } from "../data/mockData";

export default function PlayerScreen() {
  const navigation = useNavigation();
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const song = SONGS[0];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-down" size={28} color={COLORS.text} />
      </TouchableOpacity>

      <View style={[styles.art, { backgroundColor: song.color }]}>
        <Ionicons name="musical-notes" size={80} color="#fff" />
      </View>

      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
        </View>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={26} color={liked ? COLORS.primary : COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.time}>1:12</Text>
        <Text style={styles.time}>{song.duration}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="shuffle" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={30} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={() => setPlaying(!playing)}>
          <Ionicons name={playing ? "pause" : "play"} size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={30} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="repeat" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  closeBtn: {
    alignSelf: "flex-start",
    marginBottom: SPACING.lg,
  },
  art: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginTop: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  progressFill: {
    width: "35%",
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.sm,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.text,
    alignItems: "center",
    justifyContent: "center",
  },
});
