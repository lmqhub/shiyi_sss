import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '../theme'
import { getData, KEYS } from '../utils/storage'

const START_DATE = new Date('2026-02-17')

function getLoveDays() {
  const now = new Date()
  const diff = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 1
}

export default function HomeScreen({ navigation }) {
  const [days, setDays] = useState(getLoveDays())
  const [diaryCount, setDiaryCount] = useState(0)
  const [albumCount, setAlbumCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const diary = await getData(KEYS.DIARY)
      const album = await getData(KEYS.ALBUM)
      setDiaryCount(diary.length)
      setAlbumCount(album.length)
    }
    load()
    const timer = setInterval(() => setDays(getLoveDays()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.banner}>
        <Text style={styles.heartIcon}>&#x2764;</Text>
        <Text style={styles.bannerTitle}>在一起的第</Text>
        <Text style={styles.dayNumber}>{days}</Text>
        <Text style={styles.bannerSub}>天</Text>
        <Text style={styles.bannerQuote}>每一天都因为有你而变得特别</Text>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Diary')}>
          <Text style={styles.statIcon}>&#x1F4DD;</Text>
          <Text style={styles.statNum}>{diaryCount}</Text>
          <Text style={styles.statLabel}>日记</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Album')}>
          <Text style={styles.statIcon}>&#x1F4F8;</Text>
          <Text style={styles.statNum}>{albumCount}</Text>
          <Text style={styles.statLabel}>相片</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Calendar')}>
          <Text style={styles.statIcon}>&#x1F4C5;</Text>
          <Text style={styles.statNum}>3</Text>
          <Text style={styles.statLabel}>纪念日</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>&#x2764; 最近点滴</Text>
        <View style={styles.moodCard}>
          <Text style={styles.moodDate}>今天</Text>
          <Text style={styles.moodText}>和你在一起的每一天都是晴天 &#x2600;&#xFE0F;</Text>
          <View style={styles.moodBar}>
            <Text style={styles.moodLabel}>幸福指数</Text>
            <View style={styles.moodProgress}>
              <View style={[styles.moodFill, { width: '95%' }]} />
            </View>
          </View>
        </View>
        <View style={styles.moodCard}>
          <Text style={styles.moodDate}>昨天</Text>
          <Text style={styles.moodText}>一起看了日落，好美 &#x1F305;</Text>
          <View style={styles.moodBar}>
            <Text style={styles.moodLabel}>幸福指数</Text>
            <View style={styles.moodProgress}>
              <View style={[styles.moodFill, { width: '88%' }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>&#x2764; 下一个纪念日</Text>
        <View style={styles.countdownCard}>
          <Text style={styles.countdownLabel}>相遇1000天</Text>
          <Text style={styles.countdownNum}>247</Text>
          <Text style={styles.countdownUnit}>天后</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  banner: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heartIcon: {
    fontSize: 36,
    color: Colors.pink,
    marginBottom: Spacing.sm,
  },
  bannerTitle: {
    fontSize: FontSize.md,
    color: Colors.textLight,
  },
  dayNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.pink,
    marginVertical: Spacing.xs,
  },
  bannerSub: {
    fontSize: FontSize.lg,
    color: Colors.blueDark,
    fontWeight: '600',
  },
  bannerQuote: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  statNum: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.blue,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  section: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  moodCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  moodDate: {
    fontSize: FontSize.xs,
    color: Colors.pink,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  moodText: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
  },
  moodBar: {
    marginTop: Spacing.sm,
  },
  moodLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: 4,
  },
  moodProgress: {
    height: 6,
    backgroundColor: Colors.pinkLight,
    borderRadius: 3,
  },
  moodFill: {
    height: 6,
    backgroundColor: Colors.pink,
    borderRadius: 3,
  },
  countdownCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.pink,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  countdownLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  countdownNum: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.blue,
    marginVertical: Spacing.xs,
  },
  countdownUnit: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
})
