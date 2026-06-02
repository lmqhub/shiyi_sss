import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '../theme'

export default function ProfileScreen() {
  const handleReset = () => {
    Alert.alert('重置数据', '确定要清除所有数据吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      { text: '重置', style: 'destructive', onPress: async () => {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default
        await AsyncStorage.clear()
        Alert.alert('已重置', '所有数据已清空')
      }},
    ])
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>&#x2764;</Text>
        </View>
        <Text style={styles.coupleName}>我们</Text>
        <Text style={styles.since}>2026.02.17 &#x2764; 开始的故事</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>&#x1F4CA; 恋爱数据</Text>
        <View style={styles.statGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>纪念日</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>日记</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>相片</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>幸福指数</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>&#x2699;&#xFE0F; 设置</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>&#x1F4F7; 更换背景</Text>
          <Text style={styles.settingArrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>&#x1F514; 推送通知</Text>
          <Text style={styles.settingArrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>&#x1F4BE; 导出数据</Text>
          <Text style={styles.settingArrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleReset}>
          <Text style={[styles.settingText, { color: '#E74C3C' }]}>&#x26A0;&#xFE0F; 重置所有数据</Text>
          <Text style={styles.settingArrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>甜蜜记录 v1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  profileCard: {
    alignItems: 'center', paddingVertical: Spacing.xl, marginHorizontal: Spacing.md,
    marginTop: Spacing.md, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 36, color: Colors.white },
  coupleName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  since: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs },
  section: { marginHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  statGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
  },
  statItem: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center',
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 1,
  },
  statValue: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.blue },
  statLabel: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 4 },
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.blueLight,
  },
  settingText: { fontSize: FontSize.md, color: Colors.text },
  settingArrow: { fontSize: FontSize.lg, color: Colors.textLight },
  version: { textAlign: 'center', color: Colors.textLight, fontSize: FontSize.xs, marginVertical: Spacing.lg },
})
