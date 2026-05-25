const Purchases = {
  configure: jest.fn(),
  getCustomerInfo: jest.fn().mockResolvedValue({
    entitlements: { active: {} },
  }),
  getOfferings: jest.fn().mockResolvedValue({
    current: { availablePackages: [] },
  }),
  purchasePackage: jest.fn().mockResolvedValue({}),
  restorePurchases: jest.fn().mockResolvedValue({}),
}

export default Purchases
