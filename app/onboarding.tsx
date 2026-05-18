import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import { saveUserProfile, isFirstLaunchGifted, markFirstLaunchGifted, addTickets } from '../src/lib/storage'
import { UserProfile } from '../src/lib/flowerSelector'

const BLOOD_TYPES = ['A', 'B', 'O', 'AB'] as const

export default function Onboarding() {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState(new Date(1995, 0, 1))
  const [bloodType, setBloodType] = useState<UserProfile['bloodType']>('A')
  const [gifted, setGifted] = useState(false)

  const handleSave = async () => {
    const profile: UserProfile = {
      birthYear: birthDate.getFullYear(),
      birthMonth: birthDate.getMonth() + 1,
      birthDay: birthDate.getDate(),
      bloodType,
    }
    await saveUserProfile(profile)

    const alreadyGifted = await isFirstLaunchGifted()
    if (!alreadyGifted) {
      await addTickets(1)
      await markFirstLaunchGifted()
      setGifted(true)
      await new Promise(r => setTimeout(r, 1800))
    }

    router.replace('/home')
  }

  if (gifted) {
    return (
      <View className="flex-1 bg-[#FDFAF7] items-center justify-center px-8">
        <Text style={{ fontSize: 56 }} className="mb-6">🎁</Text>
        <Text className="text-gray-800 text-xl font-semibold mb-2">ようこそ！</Text>
        <Text className="text-gray-500 text-sm text-center">詳細占いチケットを{'\n'}1枚プレゼントしました</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#FDFAF7] items-center justify-center px-8">
      <Text className="text-gray-800 text-3xl font-serif mb-2">花占い</Text>
      <Text className="text-gray-500 text-sm mb-12">あなただけの花を見つけましょう</Text>

      <Text className="text-gray-700 mb-3 self-start">生年月日</Text>
      <DateTimePicker
        value={birthDate}
        mode="date"
        display="spinner"
        onChange={(_, date) => date && setBirthDate(date)}
        maximumDate={new Date()}
        style={{ width: '100%', marginBottom: 24 }}
        textColor="#1f2937"
      />

      <Text className="text-gray-700 mb-3 self-start mt-4">血液型</Text>
      <View className="flex-row gap-3 mb-12">
        {BLOOD_TYPES.map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setBloodType(type)}
            className={`w-16 h-16 rounded-full items-center justify-center border ${
              bloodType === type
                ? 'bg-rose-500 border-rose-400'
                : 'bg-white border-gray-300'
            }`}
          >
            <Text className={`text-lg font-bold ${bloodType === type ? 'text-white' : 'text-gray-600'}`}>
              {type}型
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="w-full bg-rose-500 rounded-full py-4 items-center"
      >
        <Text className="text-white text-lg font-semibold">はじめる</Text>
      </TouchableOpacity>
    </View>
  )
}
