import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { loadUserProfile, hasRevealedToday, markRevealedToday } from '../src/lib/storage'
import { selectFlower } from '../src/lib/flowerSelector'
import { selectFortune, FortuneResult } from '../src/lib/fortuneSelector'
import { FLOWERS, Flower } from '../src/data/flowers'
import { FlowerCard } from '../src/components/FlowerCard'
import { FortunePreview } from '../src/components/FortunePreview'

export default function Home() {
  const router = useRouter()
  const [flower, setFlower] = useState<Flower | null>(null)
  const [fortune, setFortune] = useState<FortuneResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const contentOpacity = useState(new Animated.Value(0))[0]

  useEffect(() => {
    ;(async () => {
      const profile = await loadUserProfile()
      if (!profile) { router.replace('/onboarding'); return }
      const today = new Date()
      setFlower(selectFlower(profile, today))
      setFortune(selectFortune(profile, today))
      // 開発中は常にボタンから始める
      const alreadyRevealed = __DEV__ ? false : await hasRevealedToday()
      setRevealed(alreadyRevealed)
      if (alreadyRevealed) showContent()
      setLoading(false)
    })()
  }, [])

  const showContent = () => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }

  const handleReveal = async () => {
    if (__DEV__) {
      const random = FLOWERS[Math.floor(Math.random() * FLOWERS.length)]
      setFlower(random)
      // DEV時はfortune再選択不要（既にsetされている）
    }
    await markRevealedToday()
    setRevealed(true)
    showContent()
  }

  if (loading || !flower || !fortune) {
    return (
      <View className="flex-1 bg-[#FDFAF7] items-center justify-center">
        <ActivityIndicator color="#f43f5e" />
      </View>
    )
  }

  if (!revealed) {
    return (
      <View className="flex-1 bg-[#FDFAF7] items-center justify-center px-8">
        <Text className="text-gray-500 text-center text-sm mb-12">
          {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
        </Text>

        <View className="w-40 h-40 rounded-full bg-rose-50 items-center justify-center mb-12 border border-rose-200">
          <Text style={{ fontSize: 64 }}>🔮</Text>
        </View>

        <Text className="text-gray-700 text-center text-base mb-2">今日のあなたに贈る花は</Text>
        <Text className="text-gray-400 text-center text-sm mb-16">ボタンを押して運命を解き明かして</Text>

        <TouchableOpacity
          onPress={handleReveal}
          className="w-full bg-rose-500 rounded-full py-5 items-center"
        >
          <Text className="text-white text-lg font-semibold">✨ 今日の花を占う</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/settings')} className="mt-8">
          <Text className="text-gray-400 text-sm">設定</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Animated.ScrollView
      style={{ opacity: contentOpacity, backgroundColor: '#FDFAF7' }}
      contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}
    >
      <Text className="text-gray-500 text-center text-sm mb-8">
        {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
      </Text>

      <FlowerCard flower={flower} />
      <FortunePreview message={fortune.message} />

      <TouchableOpacity
        onPress={() => router.push('/detail')}
        className="mx-4 mt-6 bg-rose-500 rounded-full py-4 items-center"
      >
        <Text className="text-white text-base font-semibold">詳細の占いを見る ✨</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/settings')} className="mt-4 items-center">
        <Text className="text-gray-400 text-sm">設定</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  )
}
