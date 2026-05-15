import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { addTickets } from './storage'

const API_KEY = 'YOUR_REVENUECAT_API_KEY'

export const ENTITLEMENT_ID = 'monthly_subscription'
export const PRODUCT_TICKET = 'ticket_120'

export async function initializePurchases(): Promise<void> {
  Purchases.configure({ apiKey: API_KEY })
}

export async function isSubscribed(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
  } catch {
    return false
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings()
    return offerings.current?.availablePackages ?? []
  } catch {
    return []
  }
}

export async function purchaseMonthly(pkg: PurchasesPackage): Promise<boolean> {
  try {
    await Purchases.purchasePackage(pkg)
    return true
  } catch (e: any) {
    if (e.userCancelled) return false
    throw e
  }
}

export async function purchaseTicket(pkg: PurchasesPackage): Promise<boolean> {
  try {
    await Purchases.purchasePackage(pkg)
    await addTickets(1)
    return true
  } catch (e: any) {
    if (e.userCancelled) return false
    throw e
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    await Purchases.restorePurchases()
    return true
  } catch {
    return false
  }
}
