import { View, Text, Animated } from 'react-native'
import { useEffect, useRef } from 'react'
import { Flower } from '../data/flowers'

type Props = { flower: Flower }

export function FlowerCard({ flower }: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}
      className="items-center mb-8"
    >
      <View className="w-40 h-40 rounded-full bg-gray-800 items-center justify-center mb-6 border border-gray-600">
        <Text style={{ fontSize: 80 }}>🌸</Text>
      </View>
      <Text className="text-white text-2xl font-serif mb-2">{flower.name}</Text>
      <Text className="text-gray-400 text-sm">{flower.nameEn}</Text>
      <View className="mt-4 px-6 py-3 bg-gray-800 rounded-2xl">
        <Text className="text-rose-300 text-center text-sm">花言葉：{flower.flowerLanguage}</Text>
      </View>
    </Animated.View>
  )
}
