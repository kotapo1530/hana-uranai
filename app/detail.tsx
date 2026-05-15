import { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { loadUserProfile, getTicketCount, consumeTicket } from '../src/lib/storage'
import { isSubscribed } from '../src/lib/purchaseManager'
import { selectFlower } from '../src/lib/flowerSelector'
import { Flower } from '../src/data/flowers'
import { PaywallGate } from '../src/components/PaywallGate'

type AccessState = 'loading' | 'locked' | 'unlocked'

const FORTUNE_ITEMS = [
  { key: 'love', label: '恋愛運', emoji: '💕' },
  { key: 'work', label: '仕事運', emoji: '💼' },
  { key: 'money', label: '金運', emoji: '💰' },
  { key: 'health', label: '健康運', emoji: '🌿' },
] as const

export default function Detail() {
  const router = useRouter()
  const [flower, setFlower] = useState<Flower | null>(null)
  const [access, setAccess] = useState<AccessState>('loading')

  useFocusEffect(
    useCallback(() => {
      if (access === 'loading') checkAccess()
    }, [access])
  )

  const checkAccess = async () => {
    const profile = await loadUserProfile()
    if (!profile) { router.replace('/onboarding'); return }
    setFlower(selectFlower(profile, new Date()))

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

  if (access === 'loading' || !flower) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#fb7185" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-950" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-gray-400">← 戻る</Text>
      </TouchableOpacity>
      <Text className="text-white text-2xl font-serif mb-1">{flower.name}の占い</Text>
      <Text className="text-gray-400 text-sm mb-8">詳細鑑定結果</Text>

      {access === 'locked' ? (
        <PaywallGate onUnlocked={checkAccess} />
      ) : (
        <>
          {FORTUNE_ITEMS.map(item => (
            <View key={item.key} className="mb-4 p-5 bg-gray-900 rounded-2xl border border-gray-700">
              <Text className="text-rose-300 font-semibold mb-2">{item.emoji} {item.label}</Text>
              <Text className="text-gray-200 leading-relaxed">{flower.detail[item.key]}</Text>
            </View>
          ))}
          <View className="mt-4 p-5 bg-gray-900 rounded-2xl border border-gray-700">
            <Text className="text-rose-300 font-semibold mb-2">🍀 ラッキーアイテム</Text>
            <Text className="text-gray-200">{flower.detail.luckyItem}</Text>
          </View>
          <View className="mt-4 p-5 bg-gray-900 rounded-2xl border border-gray-700">
            <Text className="text-rose-300 font-semibold mb-2">🎨 ラッキーカラー</Text>
            <Text className="text-gray-200">{flower.detail.luckyColor}</Text>
          </View>
        </>
      )}
    </ScrollView>
  )
}
