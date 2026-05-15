import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

type Props = { onUnlocked: () => void }

export function PaywallGate({ onUnlocked }: Props) {
  const router = useRouter()
  return (
    <View className="items-center py-8 px-6">
      <Text className="text-4xl mb-4">🔒</Text>
      <Text className="text-white text-lg font-semibold mb-2">詳細の占いを見るには</Text>
      <Text className="text-gray-400 text-sm text-center mb-6">
        月額プランまたは1回分のチケットで{'\n'}恋愛・仕事・金運・健康運が分かります
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/paywall')}
        className="w-full bg-rose-800 rounded-full py-4 items-center"
      >
        <Text className="text-white font-semibold">プランを見る</Text>
      </TouchableOpacity>
    </View>
  )
}
