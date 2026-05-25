import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  saveUserProfile, loadUserProfile,
  getTicketCount, consumeTicket, addTickets,
  hasRevealedToday, markRevealedToday,
  isFirstLaunchGifted, markFirstLaunchGifted,
} from '../src/lib/storage'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('プロフィールを保存・読み込みできる', async () => {
    const profile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' as const }
    await saveUserProfile(profile)
    const loaded = await loadUserProfile()
    expect(loaded).toEqual(profile)
  })

  it('プロフィール未設定の場合はnullを返す', async () => {
    const loaded = await loadUserProfile()
    expect(loaded).toBeNull()
  })

  it('初期チケット数は0', async () => {
    const count = await getTicketCount()
    expect(count).toBe(0)
  })

  it('チケットを追加できる', async () => {
    await addTickets(3)
    const count = await getTicketCount()
    expect(count).toBe(3)
  })

  it('チケットを消費できる', async () => {
    await addTickets(2)
    const result = await consumeTicket()
    expect(result).toBe(true)
    expect(await getTicketCount()).toBe(1)
  })

  it('チケットが0の場合はconsumeTicketがfalseを返す', async () => {
    const result = await consumeTicket()
    expect(result).toBe(false)
  })

  it('markRevealedToday後にhasRevealedTodayがtrueを返す', async () => {
    await markRevealedToday()
    expect(await hasRevealedToday()).toBe(true)
  })

  it('保存前はhasRevealedTodayがfalseを返す', async () => {
    expect(await hasRevealedToday()).toBe(false)
  })

  it('markFirstLaunchGifted後にisFirstLaunchGiftedがtrueを返す', async () => {
    await markFirstLaunchGifted()
    expect(await isFirstLaunchGifted()).toBe(true)
  })

  it('初回ギフト未付与の場合はfalseを返す', async () => {
    expect(await isFirstLaunchGifted()).toBe(false)
  })

  it('チケットを複数回追加できる', async () => {
    await addTickets(1)
    await addTickets(2)
    expect(await getTicketCount()).toBe(3)
  })
})
