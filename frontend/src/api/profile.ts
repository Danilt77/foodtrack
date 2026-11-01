import api from "@/api/client"

const PROFILE_URL = "accounts/profile/"

export type UserField = "username" | "email" | "daily_calories_goal"

export async function getProfile() {
  const response = await api.get(PROFILE_URL)
  return response.data
}

export async function updateUserField(
  field: UserField,
  value: string | number,
) {
  const response = await api.patch(PROFILE_URL, { [field]: value })
  return response.data
}
