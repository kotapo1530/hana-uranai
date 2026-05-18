import { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { loadUserProfile, getTicketCount, consumeTicket } from '../src/lib/storage'
import { isSubscribed } from '../src/lib/purchaseManager'
import { selectFortune, FortuneResult } from '../src/lib/fortuneSelector'
import { PaywallGate } from '../src/components/PaywallGate'

type AccessState = 'loading' | 'locked' | 'unlocked'

const FORTUNE_ITEMS = [
  { key: 'love',   label: '恋愛運', emoji: '💕' },
  { key: 'work',   label: '仕事運', emoji: '💼' },
  { key: 'money',  label: '金運',   emoji: '💰' },
  { key: 'health', label: '健康運', emoji: '🌿' },
] as const

export default function Detail() {
  const router = useRouter()
  const [fortune, setFortune] = useState<FortuneResult | null>(null)
  const [access, setAccess] = useState<AccessState>('loading')

  useFocusEffect(
    useCallback(() => {
      if (access === 'loading') checkAccess()
    }, [access])
  )

  const checkAccess = async () => {
    const profile = await loadUserProfile()
    if (!profile) { router.replace('/onboarding'); return }
    setFortune(selectFortune(profile, new Date()))

    if (__DEV__) { setAccess('unlocked'); return }

    const subscribed = await isSubscribed()
    if (subscribed) { setAccess('unlocked'); return }

    const tickets = await getTicketCount()
    if (tickets > 0) {
      await consumeTicket()
      setAccess('unlocked')
    } else {
      setAccess('locked')
    }
  }

  if (access === 'loading' || !fortune) {
    return (
      <View className="flex-1 bg-[#FDFAF7] items-center justify-center">
        <ActivityIndicator color="#f43f5e" />
      </View>
    )
  }

  return (
    <ScrollView style={{ backgroundColor: '#FDFAF7' }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-gray-500">← 戻る</Text>
      </TouchableOpacity>
      <Text className="text-gray-800 text-2xl font-serif mb-1">今日の詳細鑑定</Text>
      <Text className="text-gray-500 text-sm mb-8">詳細な運勢をご覧ください</Text>

      {access === 'locked' ? (
        <PaywallGate onUnlocked={checkAccess} />
      ) : (
        <>
          {FORTUNE_ITEMS.map(item => (
            <View key={item.key} className="mb-4 p-5 bg-white rounded-2xl border border-rose-100" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
              <Text className="text-rose-600 font-semibold mb-2">{item.emoji} {item.label}</Text>
              <Text className="text-gray-700 leading-relaxed">{fortune[item.key]}</Text>
            </View>
          ))}
          <View className="mt-4 p-5 bg-white rounded-2xl border border-rose-100" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
            <Text className="text-rose-600 font-semibold mb-2">🍀 ラッキーアイテム</Text>
            <Text className="text-gray-700">{fortune.luckyItem}</Text>
          </View>
          <View className="mt-4 p-5 bg-white rounded-2xl border border-rose-100" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
            <Text className="text-rose-600 font-semibold mb-2">🎨 ラッキーカラー</Text>
            <Text className="text-gray-700">{fortune.luckyColor}</Text>
          </View>
        </>
      )}
    </ScrollView>
  )
}
