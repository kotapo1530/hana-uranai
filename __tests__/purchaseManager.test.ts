import Purchases from 'react-native-purchases'
import { initializePurchases, isSubscribed, getOfferings, purchaseTicket, restorePurchases } from '../src/lib/purchaseManager'
import * as storage from '../src/lib/storage'

jest.mock('react-native-purchases')
jest.mock('../src/lib/storage')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('purchaseManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('initializePurchases', () => {
    it('Purchases.configureを呼ぶ', async () => {
      await initializePurchases()
      expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: 'appl_JApIggaGCnnfuwpJAkHnpxRVXQg' })
    })
  })

  describe('isSubscribed', () => {
    it('entitlementがactiveな場合trueを返す', async () => {
      ;(Purchases.getCustomerInfo as jest.Mock).mockResolvedValueOnce({
        entitlements: { active: { monthly_subscription: {} } },
      })
      const result = await isSubscribed()
      expect(result).toBe(true)
    })

    it('entitlementがない場合falseを返す', async () => {
      ;(Purchases.getCustomerInfo as jest.Mock).mockResolvedValueOnce({
        entitlements: { active: {} },
      })
      const result = await isSubscribed()
      expect(result).toBe(false)
    })

    it('エラー時はfalseを返す', async () => {
      ;(Purchases.getCustomerInfo as jest.Mock).mockRejectedValueOnce(new Error('network'))
      const result = await isSubscribed()
      expect(result).toBe(false)
    })
  })

  describe('getOfferings', () => {
    it('availablePackagesを返す', async () => {
      const mockPkg = { identifier: '$rc_monthly' } as any
      ;(Purchases.getOfferings as jest.Mock).mockResolvedValueOnce({
        current: { availablePackages: [mockPkg] },
      })
      const result = await getOfferings()
      expect(result).toEqual([mockPkg])
    })

    it('エラー時は空配列を返す', async () => {
      ;(Purchases.getOfferings as jest.Mock).mockRejectedValueOnce(new Error('network'))
      const result = await getOfferings()
      expect(result).toEqual([])
    })
  })

  describe('purchaseTicket', () => {
    it('購入後にaddTickets(1)が呼ばれる', async () => {
      const mockPkg = {} as any
      await purchaseTicket(mockPkg)
      expect(storage.addTickets).toHaveBeenCalledWith(1)
    })

    it('ユーザーキャンセル時はfalseを返す', async () => {
      const mockPkg = {} as any
      ;(Purchases.purchasePackage as jest.Mock).mockRejectedValueOnce({ userCancelled: true })
      const result = await purchaseTicket(mockPkg)
      expect(result).toBe(false)
    })
  })

  describe('restorePurchases', () => {
    it('正常時はtrueを返す', async () => {
      const result = await restorePurchases()
      expect(result).toBe(true)
    })
  })
})
