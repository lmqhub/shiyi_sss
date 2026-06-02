import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '../theme'
import { getData, addItem, removeItem, KEYS } from '../utils/storage'

const moods = [
  { emoji: '\u{1F60D}', label: '超甜' },
  { emoji: '\u{1F60A}', label: '开心' },
  { emoji: '\u{2764}\u{FE0F}', label: '心动' },
  { emoji: '\u{1F60C}', label: '平静' },
  { emoji: '\u{1F622}', label: '想你' },
]

export default function DiaryScreen() {
  const [entries, setEntries] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [text, setText] = useState('')
  const [selectedMood, setSelectedMood] = useState(0)

  useEffect(() => {
    getData(KEYS.DIARY).then(setEntries)
  }, [])

  const handleAdd = useCallback(async () => {
    if (!text.trim()) return
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const newList = await addItem(KEYS.DIARY, {
      text: text.trim(),
      mood: selectedMood,
      date: dateStr,
    })
    setEntries(newList)
    setText('')
    setSelectedMood(0)
    setModalVisible(false)
  }, [text, selectedMood])

  const handleDelete = useCallback((id) => {
    Alert.alert('删除', '确定要删除这条日记吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        const list = await removeItem(KEYS.DIARY, id)
        setEntries(list)
      }},
    ])
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>&#x1F4DD; 恋爱日记</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {entries.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>&#x1F4D6;</Text>
            <Text style={styles.emptyText}>还没有日记</Text>
            <Text style={styles.emptySub}>记录你们的每一个心动瞬间</Text>
          </View>
        )}
        {entries.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onLongPress={() => handleDelete(item.id)}>
            <View style={styles.cardHeader}>
              <Text style={styles.moodEmoji}>{moods[item.mood]?.emoji}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <Text style={styles.cardText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>写日记</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="今天发生了什么？"
              value={text}
              onChangeText={setText}
              maxLength={500}
            />
            <Text style={styles.moodTitle}>心情</Text>
            <View style={styles.moodRow}>
              {moods.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.moodOption, selectedMood === i && styles.moodSelected]}
                  onPress={() => setSelectedMood(i)}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.pink,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 24, color: Colors.white, lineHeight: 26 },
  list: { flex: 1, paddingHorizontal: Spacing.md },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, opacity: 0.3 },
  emptyText: { fontSize: FontSize.lg, color: Colors.textLight, marginTop: Spacing.md },
  emptySub: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  moodEmoji: { fontSize: 20, marginRight: Spacing.sm },
  cardDate: { fontSize: FontSize.xs, color: Colors.blue },
  cardText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Spacing.lg, paddingBottom: 40,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  modalInput: {
    borderWidth: 1, borderColor: Colors.blueLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, height: 120, textAlignVertical: 'top',
    fontSize: FontSize.md, color: Colors.text,
  },
  moodTitle: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.md, marginBottom: Spacing.sm },
  moodRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  moodOption: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  moodSelected: { backgroundColor: Colors.pinkLight },
  modalBtns: { flexDirection: 'row', gap: Spacing.sm },
  cancelBtn: {
    flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: Colors.blueLight,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { color: Colors.textLight, fontSize: FontSize.md },
  saveBtn: {
    flex: 1, height: 44, borderRadius: 22, backgroundColor: Colors.pink,
    alignItems: 'center', justifyContent: 'center',
  },
  saveText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '600' },
})
