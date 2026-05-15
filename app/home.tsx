import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { loadUserProfile } from '../src/lib/storage'
import { selectFlower } from '../src/lib/flowerSelector'
import { Flower } from '../src/data/flowers'
import { FlowerCard } from '../src/components/FlowerCard'
import { FortunePreview } from '../src/components/FortunePreview'

export default function Home() {
  const router = useRouter()
  const [flower, setFlower] = useState<Flower | null>(null)

  useEffect(() => {
    loadUserProfile().then(profile => {
      if (!profile) { router.replace('/onboarding'); return }
      setFlower(selectFlower(profile, new Date()))
    })
  }, [])

  if (!flower) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#fb7185" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-950" contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}>
      <Text className="text-gray-500 text-center text-sm mb-8">
        {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
      </Text>

      <FlowerCard flower={flower} />
      <FortunePreview flower={flower} />

      <TouchableOpacity
        onPress={() => router.push('/detail')}
        className="mx-4 mt-6 bg-rose-900 rounded-full py-4 items-center border border-rose-700"
      >
        <Text className="text-rose-100 text-base font-semibold">詳細の占いを見る ✨</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/settings')}
        className="mt-4 items-center"
      >
        <Text className="text-gray-600 text-sm">設定</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
