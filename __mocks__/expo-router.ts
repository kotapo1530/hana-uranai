import { useEffect } from 'react'

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
}))

export const useLocalSearchParams = jest.fn(() => ({}))

export const useFocusEffect = jest.fn((cb: () => void | (() => void)) => useEffect(cb, []))

export const Link = ({ children }: { children: React.ReactNode }) => children
