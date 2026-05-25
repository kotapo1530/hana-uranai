import { selectFortune } from '../src/lib/fortuneSelector'
import { UserProfile } from '../src/lib/flowerSelector'

const profile: UserProfile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' }

describe('selectFortune', () => {
  it('同じプロフィール・同じ日付は同じ結果を返す', () => {
    const date = new Date('2026-05-15')
    const r1 = selectFortune(profile, date)
    const r2 = selectFortune(profile, date)
    expect(r1).toEqual(r2)
  })

  it('全カテゴリが文字列として返る', () => {
    const result = selectFortune(profile, new Date('2026-05-15'))
    expect(typeof result.love).toBe('string')
    expect(typeof result.work).toBe('string')
    expect(typeof result.money).toBe('string')
    expect(typeof result.health).toBe('string')
    expect(typeof result.luckyColor).toBe('string')
    expect(typeof result.luckyItem).toBe('string')
    expect(typeof result.message).toBe('string')
  })

  it('全カテゴリが空文字でない', () => {
    const result = selectFortune(profile, new Date('2026-05-15'))
    expect(result.love.length).toBeGreaterThan(0)
    expect(result.work.length).toBeGreaterThan(0)
    expect(result.money.length).toBeGreaterThan(0)
    expect(result.health.length).toBeGreaterThan(0)
  })

  it('日付が変わると結果が変わる（ほとんどの場合）', () => {
    const results = Array.from({ length: 10 }, (_, i) => {
      const date = new Date(2026, 4, i + 1)
      return selectFortune(profile, date).love
    })
    const unique = new Set(results)
    expect(unique.size).toBeGreaterThan(1)
  })

  it('異なる血液型で異なる結果になることがある', () => {
    const date = new Date('2026-05-15')
    const profileB: UserProfile = { ...profile, bloodType: 'B' }
    const rA = selectFortune(profile, date)
    const rB = selectFortune(profileB, date)
    expect(rA).toBeDefined()
    expect(rB).toBeDefined()
  })
})
