import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import Detail from '../../app/detail'
import * as storage from '../../src/lib/storage'
import * as purchaseManager from '../../src/lib/purchaseManager'
import { useRouter } from 'expo-router'

jest.mock('expo-router')
jest.mock('../../src/lib/storage')
jest.mock('../../src/lib/purchaseManager')
jest.mock('../../src/components/PaywallGate', () => {
  const { Text } = require('react-native')
  return { PaywallGate: () => <Text>PaywallGate</Text> }
})
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() }
;(useRouter as jest.Mock).mockReturnValue(mockRouter)

const mockProfile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' as const }

describe('Detail screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('プロフィール未設定の場合はオンボーディングにリダイレクト', async () => {
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(null)
    render(<Detail />)
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('サブスク済みの場合は詳細占いが表示される', async () => {
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(mockProfile)
    ;(purchaseManager.isSubscribed as jest.Mock).mockResolvedValue(true)
    const { getByText } = render(<Detail />)
    await waitFor(() => {
      expect(getByText('今日の詳細鑑定')).toBeTruthy()
    })
  })

  it('チケットがある場合は消費して詳細を表示（本番モード）', async () => {
    ;(global as any).__DEV__ = false
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(mockProfile)
    ;(purchaseManager.isSubscribed as jest.Mock).mockResolvedValue(false)
    ;(storage.getTicketCount as jest.Mock).mockResolvedValue(1)
    ;(storage.consumeTicket as jest.Mock).mockResolvedValue(true)
    const { getByText } = render(<Detail />)
    await waitFor(() => {
      expect(storage.consumeTicket).toHaveBeenCalled()
      expect(getByText('今日の詳細鑑定')).toBeTruthy()
    })
    ;(global as any).__DEV__ = true
  })

  it('チケットなし・未サブスクの場合はペイウォールを表示（本番モード）', async () => {
    ;(global as any).__DEV__ = false
    ;(storage.loadUserProfile as jest.Mock).mockResolvedValue(mockProfile)
    ;(purchaseManager.isSubscribed as jest.Mock).mockResolvedValue(false)
    ;(storage.getTicketCount as jest.Mock).mockResolvedValue(0)
    const { getByText } = render(<Detail />)
    await waitFor(() => {
      expect(getByText('PaywallGate')).toBeTruthy()
    })
    ;(global as any).__DEV__ = true
  })
})
