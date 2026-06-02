import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '../theme'
import { getData, addItem, removeItem, KEYS } from '../utils/storage'

export default function AlbumScreen() {
  const [photos, setPhotos] = useState([])
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    getData(KEYS.ALBUM).then(setPhotos)
  }, [])

  const handleDelete = useCallback((id) => {
    Alert.alert('删除', '确定要删除这张照片吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        const list = await removeItem(KEYS.ALBUM, id)
        setPhotos(list)
      }},
    ])
  }, [])

  const addSamplePhoto = useCallback(async () => {
    const samples = [
      { uri: null, text: '\u{1F308} 一起看过的日落', color: '#FFE4E1' },
      { uri: null, text: '\u{1F33A} 第一次约会', color: '#E8F0FE' },
      { uri: null, text: '\u{1F30A} 海边旅行', color: '#E0F0E8' },
      { uri: null, text: '\u{1F339} 惊喜礼物', color: '#FFF0E0' },
      { uri: null, text: '\u{1F37A} 周末小酌', color: '#F0E8F0' },
      { uri: null, text: '\u{1F33F} 一起做饭', color: '#FFF5E0' },
    ]
    const sample = samples[Math.floor(Math.random() * samples.length)]
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const newList = await addItem(KEYS.ALBUM, {
      text: sample.text,
      color: sample.color,
      date: dateStr,
    })
    setPhotos(newList)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>&#x1F4F8; 甜蜜相册</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addSamplePhoto}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {photos.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>&#x1F5BC;</Text>
              <Text style={styles.emptyText}>还没有照片</Text>
              <Text style={styles.emptySub}>记录你们的美好时光</Text>
            </View>
          )}
          {photos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.photoCard, { backgroundColor: item.color || Colors.pinkLight }]}
              onPress={() => setPreview(item)}
              onLongPress={() => handleDelete(item.id)}
            >
              {item.uri ? (
                <Image source={{ uri: item.uri }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoEmoji}>{item.text.split(' ')[0]}</Text>
                </View>
              )}
              <View style={styles.photoInfo}>
                <Text style={styles.photoText} numberOfLines={1}>{item.text}</Text>
                <Text style={styles.photoDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!preview} transparent animationType="fade">
        <TouchableOpacity style={styles.previewOverlay} onPress={() => setPreview(null)} activeOpacity={1}>
          {preview && (
            <View style={[styles.previewCard, { backgroundColor: preview.color || Colors.white }]}>
              <Text style={styles.previewEmoji}>{preview.text?.split(' ')[0] || '\u{2764}\u{FE0F}'}</Text>
              <Text style={styles.previewText}>{preview.text}</Text>
              <Text style={styles.previewDate}>{preview.date}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  addBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.blue,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 24, color: Colors.white, lineHeight: 26 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.sm,
  },
  empty: { width: '100%', alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, opacity: 0.3 },
  emptyText: { fontSize: FontSize.lg, color: Colors.textLight, marginTop: Spacing.md },
  emptySub: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs },
  photoCard: {
    width: '46%', marginHorizontal: '2%', marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md, overflow: 'hidden',
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  photo: { width: '100%', height: 150 },
  photoPlaceholder: {
    height: 120, alignItems: 'center', justifyContent: 'center',
  },
  photoEmoji: { fontSize: 40 },
  photoInfo: { padding: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.9)' },
  photoText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '500' },
  photoDate: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  previewOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  previewCard: {
    width: '80%', borderRadius: BorderRadius.lg, padding: Spacing.xl,
    alignItems: 'center',
  },
  previewEmoji: { fontSize: 64, marginBottom: Spacing.md },
  previewText: { fontSize: FontSize.lg, color: Colors.text, textAlign: 'center' },
  previewDate: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.sm },
})
