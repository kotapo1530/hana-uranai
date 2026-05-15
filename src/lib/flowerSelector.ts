import { FLOWERS, Flower, Season, getSeasonFromMonth } from '../data/flowers'

export type UserProfile = {
  birthYear: number
  birthMonth: number
  birthDay: number
  bloodType: 'A' | 'B' | 'O' | 'AB'
}

const BLOOD_TYPE_COEFF: Record<UserProfile['bloodType'], number> = {
  A: 1, B: 2, O: 3, AB: 4,
}

function seededRandom(seed: number): number {
  const a = 1664525
  const c = 1013904223
  const m = 2 ** 32
  return ((a * seed + c) % m) / m
}

export function selectFlower(profile: UserProfile, date: Date): Flower {
  const dateNum =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()

  const birthNum =
    profile.birthYear * 10000 +
    profile.birthMonth * 100 +
    profile.birthDay

  const seed = birthNum + BLOOD_TYPE_COEFF[profile.bloodType] * 1000 + dateNum

  const currentSeason: Season = getSeasonFromMonth(date.getMonth() + 1)
  const inSeason = FLOWERS.filter(f => f.season === currentSeason)
  const outOfSeason = FLOWERS.filter(f => f.season !== currentSeason)

  const rand = seededRandom(seed)
  if (rand < 0.7 && inSeason.length > 0) {
    const idx = Math.floor(seededRandom(seed + 1) * inSeason.length)
    return inSeason[idx]
  } else {
    const idx = Math.floor(seededRandom(seed + 2) * outOfSeason.length)
    return outOfSeason[idx]
  }
}
