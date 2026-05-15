import { View, Text, Animated } from 'react-native'
import { useEffect, useRef } from 'react'
import { Flower } from '../data/flowers'

type Props = { flower: Flower }

export function FlowerCard({ flower }: Props) {
  const circleScale = useRef(new Animated.Value(0)).current
  const circleOpacity = useRef(new Animated.Value(0)).current
  const glowScale = useRef(new Animated.Value(1)).current
  const nameOpacity = useRef(new Animated.Value(0)).current
  const nameTranslateY = useRef(new Animated.Value(12)).current
  const nameEnOpacity = useRef(new Animated.Value(0)).current
  const badgeOpacity = useRef(new Animated.Value(0)).current
  const badgeTranslateY = useRef(new Animated.Value(12)).current

  useEffect(() => {
    // 1. 花サークルがズームイン
    Animated.sequence([
      Animated.parallel([
        Animated.spring(circleScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 2. 名前が時間差でフェードイン
      Animated.parallel([
        Animated.timing(nameOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(nameTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      // 3. 英名
      Animated.timing(nameEnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      // 4. 花言葉バッジ
      Animated.parallel([
        Animated.timing(badgeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(badgeTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start()

    // グロー：ループパルス
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, { toValue: 1.12, duration: 1400, useNativeDriver: true }),
        Animated.timing(glowScale, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  return (
    <View className="items-center mb-8">
      {/* グロー輪 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -8,
          width: 176,
          height: 176,
          borderRadius: 88,
          backgroundColor: 'rgba(251, 113, 133, 0.12)',
          transform: [{ scale: glowScale }],
          opacity: circleOpacity,
        }}
      />

      {/* 花サークル */}
      <Animated.View
        style={{
          transform: [{ scale: circleScale }],
          opacity: circleOpacity,
        }}
        className="w-40 h-40 rounded-full bg-gray-800 items-center justify-center mb-6 border border-gray-700"
      >
        <Text style={{ fontSize: 80 }}>{flower.emoji}</Text>
      </Animated.View>

      {/* 花の名前 */}
      <Animated.Text
        style={{ opacity: nameOpacity, transform: [{ translateY: nameTranslateY }] }}
        className="text-white text-2xl font-serif mb-1"
      >
        {flower.name}
      </Animated.Text>

      {/* 英名 */}
      <Animated.Text
        style={{ opacity: nameEnOpacity }}
        className="text-gray-500 text-xs tracking-widest mb-4"
      >
        {flower.nameEn.toUpperCase()}
      </Animated.Text>

      {/* 花言葉バッジ */}
      <Animated.View
        style={{ opacity: badgeOpacity, transform: [{ translateY: badgeTranslateY }] }}
        className="px-6 py-3 bg-gray-800 rounded-2xl border border-gray-700"
      >
        <Text className="text-rose-300 text-center text-sm">
          花言葉：{flower.flowerLanguage}
        </Text>
      </Animated.View>
    </View>
  )
}
