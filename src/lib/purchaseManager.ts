import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { addTickets } from './storage'

const API_KEY = 'appl_JApIggaGCnnfuwpJAkHnpxRVXQg'

export const ENTITLEMENT_ID = 'monthly_subscription'
export const PRODUCT_TICKET = 'ticket_120'

export async function initializePurchases(): Promise<void> {
  try {
    Purchases.configure({ apiKey: API_KEY })
  } catch {
    // Native module unavailable
  }
}

export async function isSubscribed(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
  } catch (e) {
    console.error('[RevenueCat] isSubscribed error:', e)
    return false
  }
}

export async function getOfferings(): Promise<{ packages: PurchasesPackage[]; error?: string }> {
  try {
    const offerings = await Purchases.getOfferings()
    console.log('[RevenueCat] offerings.current:', offerings.current?.identifier ?? 'null')
    console.log('[RevenueCat] availablePackages:', offerings.current?.availablePackages?.length ?? 0)
    return { packages: offerings.current?.availablePackages ?? [] }
  } catch (e: any) {
    const msg = e?.message ?? String(e)
    console.error('[RevenueCat] getOfferings error:', msg)
    return { packages: [], error: msg }
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
