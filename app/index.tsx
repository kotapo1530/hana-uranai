import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { loadUserProfile } from '../src/lib/storage'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    loadUserProfile().then(profile => {
      if (profile) {
        router.replace('/home')
      } else {
        router.replace('/onboarding')
      }
    })
  }, [])

  return null
}
