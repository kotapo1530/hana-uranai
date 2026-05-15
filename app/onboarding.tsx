import { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import { saveUserProfile } from '../src/lib/storage'
import { UserProfile } from '../src/lib/flowerSelector'

const BLOOD_TYPES = ['A', 'B', 'O', 'AB'] as const

export default function Onboarding() {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState(new Date(1995, 0, 1))
  const [bloodType, setBloodType] = useState<UserProfile['bloodType']>('A')

  const handleSave = async () => {
    const profile: UserProfile = {
      birthYear: birthDate.getFullYear(),
      birthMonth: birthDate.getMonth() + 1,
      birthDay: birthDate.getDate(),
      bloodType,
    }
    await saveUserProfile(profile)
    router.replace('/home')
  }

  return (
    <View className="flex-1 bg-gray-950 items-center justify-center px-8">
      <Text className="text-white text-3xl font-serif mb-2">花占い</Text>
      <Text className="text-gray-400 text-sm mb-12">あなただけの花を見つけましょう</Text>

      <Text className="text-gray-300 mb-3 self-start">生年月日</Text>
      <DateTimePicker
        value={birthDate}
        mode="date"
        display="spinner"
        onChange={(_, date) => date && setBirthDate(date)}
        maximumDate={new Date()}
        style={{ width: '100%', marginBottom: 24 }}
        textColor="white"
      />

      <Text className="text-gray-300 mb-3 self-start mt-4">血液型</Text>
      <View className="flex-row gap-3 mb-12">
        {BLOOD_TYPES.map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setBloodType(type)}
            className={`w-16 h-16 rounded-full items-center justify-center border ${
              bloodType === type
                ? 'bg-rose-900 border-rose-400'
                : 'bg-gray-800 border-gray-600'
            }`}
          >
            <Text className={`text-lg font-bold ${bloodType === type ? 'text-rose-200' : 'text-gray-400'}`}>
              {type}型
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="w-full bg-rose-800 rounded-full py-4 items-center"
      >
        <Text className="text-white text-lg font-semibold">はじめる</Text>
      </TouchableOpacity>
    </View>
  )
}
