import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserProfile } from './flowerSelector'

const KEYS = {
  USER_PROFILE: 'user_profile',
  TICKET_COUNT: 'ticket_count',
  LAST_REVEALED_DATE: 'last_revealed_date',
  FIRST_LAUNCH_GIFTED: 'first_launch_gifted',
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile))
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE)
  return raw ? JSON.parse(raw) : null
}

export async function getTicketCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.TICKET_COUNT)
  return raw ? parseInt(raw, 10) : 0
}

export async function addTickets(count: number): Promise<void> {
  const current = await getTicketCount()
  await AsyncStorage.setItem(KEYS.TICKET_COUNT, String(current + count))
}

export async function consumeTicket(): Promise<boolean> {
  const current = await getTicketCount()
  if (current <= 0) return false
  await AsyncStorage.setItem(KEYS.TICKET_COUNT, String(current - 1))
  return true
}

function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export async function hasRevealedToday(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(KEYS.LAST_REVEALED_DATE)
  return stored === todayString()
}

export async function markRevealedToday(): Promise<void> {
  await AsyncStorage.setItem(KEYS.LAST_REVEALED_DATE, todayString())
}

export async function isFirstLaunchGifted(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.FIRST_LAUNCH_GIFTED)) === 'true'
}

export async function markFirstLaunchGifted(): Promise<void> {
  await AsyncStorage.setItem(KEYS.FIRST_LAUNCH_GIFTED, 'true')
}
