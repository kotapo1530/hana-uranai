import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { restorePurchases } from '../src/lib/purchaseManager'

export default function Settings() {
  const router = useRouter()

  const handleResetProfile = async () => {
    Alert.alert('プロフィールをリセット', '生年月日と血液型を再入力します', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'リセット', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user_profile')
          router.replace('/onboarding')
        },
      },
    ])
  }

  const handleRestore = async () => {
    const success = await restorePurchases()
    Alert.alert(success ? '復元完了' : 'エラー', success ? '購入履歴を復元しました' : '復元に失敗しました')
  }

  return (
    <View className="flex-1 bg-[#FDFAF7] pt-16 px-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Text className="text-gray-500">← 戻る</Text>
      </TouchableOpacity>

      <Text className="text-gray-800 text-2xl font-serif mb-8">設定</Text>

      <TouchableOpacity onPress={handleResetProfile} className="py-4 border-b border-gray-200">
        <Text className="text-gray-800">プロフィールを変更</Text>
        <Text className="text-gray-500 text-sm">生年月日・血液型を再設定</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRestore} className="py-4 border-b border-gray-200">
        <Text className="text-gray-800">購入を復元する</Text>
        <Text className="text-gray-500 text-sm">サブスクの購入履歴を復元</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/paywall')} className="py-4 border-b border-gray-200">
        <Text className="text-gray-800">プランを見る</Text>
        <Text className="text-gray-500 text-sm">月額・都度チケットの確認</Text>
      </TouchableOpacity>
    </View>
  )
}
