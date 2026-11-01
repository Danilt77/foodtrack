import api from "@/api/client"

const FOOD_ENTRIES_URL = "foodtrack/food-entries/"
const DAILY_FOOD_LOGS_URL = "foodtrack/daily-food-logs/"

interface CreateFoodEntryData {
  date: string
  food_name: string
  protein_per_100g: string
  fat_per_100g: string
  carbs_per_100g: string
  calories_per_100g: string
  amount: string
}

export async function getFoodEntriesByDate(date: string) {
  const response = await api.get(FOOD_ENTRIES_URL, { params: { date } })
  return response.data
}

export async function createFoodEntry(data: CreateFoodEntryData) {
  const response = await api.post(FOOD_ENTRIES_URL, data)
  return response.data
}

export async function deleteFoodEntry(id: string) {
  await api.delete(FOOD_ENTRIES_URL + id + "/")
}

export async function getDailyFoodLogs() {
  const response = await api.get(DAILY_FOOD_LOGS_URL)
  return response.data
}
