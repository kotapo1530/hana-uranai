import { View, Text } from 'react-native'
import { Flower } from '../data/flowers'

type Props = { flower: Flower }

export function FortunePreview({ flower }: Props) {
  return (
    <View className="px-6 py-5 bg-gray-900 rounded-2xl border border-gray-700 mx-4">
      <Text className="text-gray-400 text-xs mb-2 text-center">今日のメッセージ</Text>
      <Text className="text-white text-center text-base leading-relaxed">
        {flower.freeText}
      </Text>
    </View>
  )
}
