import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '../theme'
import { getData, addItem, removeItem, KEYS } from '../utils/storage'

const defaultEvents = [
  { id: 'default-1', title: '\u{1F496} 在一起的日子', date: '2026-02-17', emoji: '\u{2764}\u{FE0F}' },
  { id: 'default-2', title: '\u{1F389} 第一次约会', date: '2026-03-01', emoji: '\u{1F389}' },
  { id: 'default-3', title: '\u{1F38A} 100天纪念', date: '2026-05-27', emoji: '\u{1F38A}' },
]

function daysUntil(dateStr) {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return diff
}

export default function CalendarScreen() {
  const [events, setEvents] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [emoji, setEmoji] = useState('\u{2764}\u{FE0F}')

  useEffect(() => {
    getData(KEYS.CALENDAR).then(saved => {
      setEvents([...defaultEvents, ...saved])
    })
  }, [])

  const handleAdd = useCallback(async () => {
    if (!title.trim() || !date.trim()) return
    const newList = await addItem(KEYS.CALENDAR, { title: title.trim(), date, emoji })
    setEvents([...defaultEvents, ...newList])
    setTitle(''); setDate(''); setEmoji('\u{2764}\u{FE0F}')
    setModalVisible(false)
  }, [title, date, emoji])

  const handleDelete = useCallback((id) => {
    if (id.startsWith('default-')) return
    Alert.alert('删除', '确定要删除这个纪念日吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        const list = await removeItem(KEYS.CALENDAR, id)
        setEvents([...defaultEvents, ...list])
      }},
    ])
  }, [])

  const emojis = ['\u{2764}\u{FE0F}', '\u{1F389}', '\u{1F38A}', '\u{1F496}', '\u{1F339}', '\u{1F525}', '\u{1F31F}', '\u{1F308}']

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>&#x1F4C5; 纪念日</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {events.sort((a, b) => daysUntil(a.date) - daysUntil(b.date)).map((item) => {
          const days = daysUntil(item.date)
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onLongPress={() => handleDelete(item.id)}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.cardCenter}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={[styles.cardDays, days < 0 && { color: Colors.textLight }]}>
                  {days >= 0 ? days : Math.abs(days)}
                </Text>
                <Text style={styles.cardUnit}>{days >= 0 ? '天后' : '天前'}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>添加纪念日</Text>
            <TextInput style={styles.input} placeholder="名称" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="日期 2026-12-25" value={date} onChangeText={setDate} />
            <Text style={styles.emojiTitle}>选择图标</Text>
            <View style={styles.emojiRow}>
              {emojis.map((e, i) => (
                <TouchableOpacity key={i} style={[styles.emojiOption, emoji === e && styles.emojiSelected]} onPress={() => setEmoji(e)}>
                  <Text style={{ fontSize: 24 }}>{e}</Text>
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
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  cardLeft: { width: 50, alignItems: 'center' },
  cardEmoji: { fontSize: 28 },
  cardCenter: { flex: 1, marginLeft: Spacing.sm },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  cardDate: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  cardRight: { alignItems: 'center' },
  cardDays: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.blue },
  cardUnit: { fontSize: FontSize.xs, color: Colors.textLight },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Spacing.lg, paddingBottom: 40,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  input: {
    borderWidth: 1, borderColor: Colors.blueLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, fontSize: FontSize.md, color: Colors.text,
  },
  emojiTitle: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  emojiRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg, flexWrap: 'wrap' },
  emojiOption: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  emojiSelected: { backgroundColor: Colors.pinkLight },
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
