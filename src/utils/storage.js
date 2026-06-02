import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  DIARY: '@love_diary',
  ALBUM: '@love_album',
  CALENDAR: '@love_calendar',
  PROFILE: '@love_profile',
  MESSAGES: '@love_messages',
  WISHLIST: '@love_wishlist',
}

export const getData = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key)
    return json != null ? JSON.parse(json) : []
  } catch (e) {
    return []
  }
}

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

export const addItem = async (key, item) => {
  const list = await getData(key)
  list.unshift({ id: Date.now().toString(), ...item })
  await setData(key, list)
  return list
}

export const removeItem = async (key, id) => {
  const list = await getData(key)
  const filtered = list.filter(i => i.id !== id)
  await setData(key, filtered)
  return filtered
}

export { KEYS }
