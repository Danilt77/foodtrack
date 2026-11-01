import { getProfile } from "@/api/profile"
import { create } from "zustand"

export interface User {
  id: number
  username: string
  email: string
  daily_calories_goal: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  isCheckingAuth: boolean
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isCheckingAuth: true,
  checkAuth: async () => {
    set({ isCheckingAuth: true })
    try {
      const user = await getProfile()
      set({ user })
    } catch {
      set({ user: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },
}))
