import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import Onboarding from '../../app/onboarding'
import * as storage from '../../src/lib/storage'
import { useRouter } from 'expo-router'

jest.mock('expo-router')
jest.mock('../../src/lib/storage')
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() }
;(useRouter as jest.Mock).mockReturnValue(mockRouter)

describe('Onboarding screen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('はじめるボタンが表示される', () => {
    const { getByText } = render(<Onboarding />)
    expect(getByText('はじめる')).toBeTruthy()
  })

  it('血液型ボタンが4つ表示される', () => {
    const { getByText } = render(<Onboarding />)
    expect(getByText('A型')).toBeTruthy()
    expect(getByText('B型')).toBeTruthy()
    expect(getByText('O型')).toBeTruthy()
    expect(getByText('AB型')).toBeTruthy()
  })

  it('はじめるを押すとプロフィールが保存されホームに遷移する', async () => {
    ;(storage.saveUserProfile as jest.Mock).mockResolvedValue(undefined)
    ;(storage.isFirstLaunchGifted as jest.Mock).mockResolvedValue(true)
    ;(storage.addTickets as jest.Mock).mockResolvedValue(undefined)
    ;(storage.markFirstLaunchGifted as jest.Mock).mockResolvedValue(undefined)

    const { getByText } = render(<Onboarding />)
    fireEvent.press(getByText('はじめる'))

    await waitFor(() => {
      expect(storage.saveUserProfile).toHaveBeenCalled()
      expect(mockRouter.replace).toHaveBeenCalledWith('/home')
    })
  })

  it('初回起動時はチケット1枚付与される', async () => {
    ;(storage.saveUserProfile as jest.Mock).mockResolvedValue(undefined)
    ;(storage.isFirstLaunchGifted as jest.Mock).mockResolvedValue(false)
    ;(storage.addTickets as jest.Mock).mockResolvedValue(undefined)
    ;(storage.markFirstLaunchGifted as jest.Mock).mockResolvedValue(undefined)

    const { getByText } = render(<Onboarding />)
    fireEvent.press(getByText('はじめる'))

    await waitFor(() => {
      expect(storage.addTickets).toHaveBeenCalledWith(1)
    })
  })
})
