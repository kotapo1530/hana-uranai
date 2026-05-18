import { UserProfile } from './flowerSelector'
import {
  LOVE_FORTUNES,
  WORK_FORTUNES,
  MONEY_FORTUNES,
  HEALTH_FORTUNES,
  MESSAGES,
  LUCKY_COLORS,
  LUCKY_ITEMS,
} from '../data/fortunes'

export type FortuneResult = {
  love: string
  work: string
  money: string
  health: string
  luckyColor: string
  luckyItem: string
  message: string
}

function seededRandom(seed: number): number {
  const a = 1664525
  const c = 1013904223
  const m = 2 ** 32
  return ((a * seed + c) % m) / m
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)]
}

export function selectFortune(profile: UserProfile, date: Date): FortuneResult {
  const dateNum =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()

  const birthNum =
    profile.birthYear * 10000 +
    profile.birthMonth * 100 +
    profile.birthDay

  const base = birthNum * 7 + dateNum * 3

  return {
    love:       pick(LOVE_FORTUNES,   base + 101),
    work:       pick(WORK_FORTUNES,   base + 202),
    money:      pick(MONEY_FORTUNES,  base + 303),
    health:     pick(HEALTH_FORTUNES, base + 404),
    luckyColor: pick(LUCKY_COLORS,    base + 505),
    luckyItem:  pick(LUCKY_ITEMS,     base + 606),
    message:    pick(MESSAGES,        base + 707),
  }
}
