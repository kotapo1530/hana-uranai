import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { initializePurchases } from '../src/lib/purchaseManager'
import '../global.css'

export default function RootLayout() {
  useEffect(() => {
    initializePurchases()
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="home" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="paywall" />
      <Stack.Screen name="settings" />
    </Stack>
  )
}
