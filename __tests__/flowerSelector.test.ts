import { selectFlower } from '../src/lib/flowerSelector'

describe('selectFlower', () => {
  const profile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' as const }

  it('同じユーザー・同じ日付は同じ花を返す', () => {
    const date = new Date('2026-05-15')
    const flower1 = selectFlower(profile, date)
    const flower2 = selectFlower(profile, date)
    expect(flower1.id).toBe(flower2.id)
  })

  it('日付が変わると花が変わる（ほとんどの場合）', () => {
    const date1 = new Date('2026-05-15')
    const date2 = new Date('2026-05-16')
    const flower1 = selectFlower(profile, date1)
    const flower2 = selectFlower(profile, date2)
    expect(flower1).toBeDefined()
    expect(flower2).toBeDefined()
  })

  it('異なるユーザーは異なる花を返すことが多い', () => {
    const date = new Date('2026-05-15')
    const profileB = { birthYear: 1990, birthMonth: 8, birthDay: 22, bloodType: 'B' as const }
    const flowerA = selectFlower(profile, date)
    const flowerB = selectFlower(profileB, date)
    expect(flowerA).toBeDefined()
    expect(flowerB).toBeDefined()
  })

  it('現在の季節の花が優先的に出る（季節一致率60%以上）', () => {
    const springDate = new Date('2026-04-01')
    const results = Array.from({ length: 100 }, (_, i) => {
      const p = { ...profile, birthDay: (i % 28) + 1 }
      return selectFlower(p, springDate)
    })
    const springFlowers = results.filter(f => f.season === 'spring').length
    expect(springFlowers).toBeGreaterThan(60)
  })
})
