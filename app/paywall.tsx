import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { PurchasesPackage } from 'react-native-purchases'
import { getOfferings, purchaseMonthly, purchaseTicket, restorePurchases } from '../src/lib/purchaseManager'

export default function Paywall() {
  const router = useRouter()
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    getOfferings().then(pkgs => { setPackages(pkgs); setLoading(false) })
  }, [])

  const handleMonthly = async (pkg: PurchasesPackage) => {
    setPurchasing(true)
    try {
      const success = await purchaseMonthly(pkg)
      if (success) { router.back() }
    } catch {
      Alert.alert('エラー', '購入に失敗しました')
    } finally {
      setPurchasing(false)
    }
  }

  const handleTicket = async (pkg: PurchasesPackage) => {
    setPurchasing(true)
    try {
      const success = await purchaseTicket(pkg)
      if (success) { router.back() }
    } catch {
      Alert.alert('エラー', '購入に失敗しました')
    } finally {
      setPurchasing(false)
    }
  }

  const monthlyPkg = packages.find(p => p.product.identifier === 'monthly_480')
  const ticketPkg = packages.find(p => p.product.identifier === 'ticket_120')

  return (
    <View className="flex-1 bg-gray-950 px-6 pt-16 pb-8">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Text className="text-gray-400">← 戻る</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl font-serif mb-2">プランを選ぶ</Text>
      <Text className="text-gray-400 text-sm mb-10">詳細の占いで毎日の運気をチェック</Text>

      {loading ? (
        <ActivityIndicator color="#fb7185" />
      ) : (
        <>
          {monthlyPkg && (
            <TouchableOpacity
              onPress={() => handleMonthly(monthlyPkg)}
              disabled={purchasing}
              className="p-6 bg-rose-950 rounded-2xl border-2 border-rose-600 mb-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-bold text-lg">月額プラン</Text>
                <View className="bg-rose-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">おすすめ</Text>
                </View>
              </View>
              <Text className="text-rose-300 text-2xl font-bold mb-1">¥480 / 月</Text>
              <Text className="text-gray-400 text-sm">毎日詳細が見放題・いつでも解約可</Text>
            </TouchableOpacity>
          )}

          {ticketPkg && (
            <TouchableOpacity
              onPress={() => handleTicket(ticketPkg)}
              disabled={purchasing}
              className="p-6 bg-gray-900 rounded-2xl border border-gray-700 mb-8"
            >
              <Text className="text-white font-bold text-lg mb-1">1回チケット</Text>
              <Text className="text-gray-300 text-2xl font-bold mb-1">¥120 / 回</Text>
              <Text className="text-gray-400 text-sm">今日1回だけ詳細を見たい方向け</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => restorePurchases().then(() => router.back())} className="items-center">
            <Text className="text-gray-500 text-sm">購入を復元する</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
