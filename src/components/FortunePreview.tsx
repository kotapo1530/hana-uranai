import { View, Text } from 'react-native'

type Props = { message: string }

export function FortunePreview({ message }: Props) {
  return (
    <View className="px-6 py-5 bg-white rounded-2xl border border-rose-100 mx-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
      <Text className="text-gray-500 text-xs mb-2 text-center">今日のメッセージ</Text>
      <Text className="text-gray-700 text-center text-base leading-relaxed">
        {message}
      </Text>
    </View>
  )
}
