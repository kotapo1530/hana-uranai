import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import Home from '../../app/home'
import * as storage from '../../src/lib/storage'
import { useRouter } from 'expo-router'

jest.mock('expo-router')
jest.mock('../../src/lib/storage')
jest.mock('../../src/lib/purchaseManager')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() }
;(useRouter as jest.Mock).mockReturnValue(mockRouter)

const mockProfile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' as const }

describe('Home screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('プロフィール未設定の場合はオンボーディングにリダイレクト', async () => {
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(null)
    render(<Home />)
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('プロフィールがある場合は花カードが表示される', async () => {
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(mockProfile)
    ;(storage.hasRevealedToday as jest.Mock).mockResolvedValue(false)
    const { getByText } = render(<Home />)
    await waitFor(() => {
      expect(getByText('✨ 今日の花を占う')).toBeTruthy()
    })
  })

  it('占うボタンを押すと花が表示される', async () => {
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(mockProfile)
    ;(storage.hasRevealedToday as jest.Mock).mockResolvedValue(false)
    ;(storage.markRevealedToday as jest.Mock).mockResolvedValue(undefined)
    const { getByText } = render(<Home />)
    await waitFor(() => getByText('✨ 今日の花を占う'))
    fireEvent.press(getByText('✨ 今日の花を占う'))
    await waitFor(() => {
      expect(storage.markRevealedToday).toHaveBeenCalled()
    })
  })

  it('既に占い済みの場合は直接花カードを表示（本番モード）', async () => {
    ;(global as any).__DEV__ = false
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(mockProfile)
    ;(storage.hasRevealedToday as jest.Mock).mockResolvedValue(true)
    const { getByText } = render(<Home />)
    await waitFor(() => {
      expect(getByText('詳細の占いを見る ✨')).toBeTruthy()
    })
    ;(global as any).__DEV__ = true
  })
})
