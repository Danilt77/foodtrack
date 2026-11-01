import { useParams } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import AddMealItemDialog from "@/components/AddMealItemDialog"
import { ChartPieDonutText } from "@/components/ui/chart-pie-donut-text"
import FoodEntryList from "@/components/FoodEntryList"
import type { NutritionValues } from "@/components/FoodEntryList"
import { getFoodEntriesByDate } from "@/api/diary"
import { useAuthStore } from "@/store/authStore"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CircleX, RefreshCw, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FoodEntry {
  id: string
  daily_food_log_date: string
  food_name: string
  protein_per_100g: string
  fat_per_100g: string
  carbs_per_100g: string
  calories_per_100g: string
  amount: string
}

const isValidDateString = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const date = new Date(`${value}T00:00:00.000Z`)
  return (
    !Number.isNaN(date.getTime) && date.toISOString().slice(0, 10) === value
  )
}

const calculateTotalNutritionalValues = (foodEntry: FoodEntry) => {
  const values = {
    protein:
      (Number(foodEntry.protein_per_100g) * Number(foodEntry.amount)) / 100,
    fat: (Number(foodEntry.fat_per_100g) * Number(foodEntry.amount)) / 100,
    carbs: (Number(foodEntry.carbs_per_100g) * Number(foodEntry.amount)) / 100,
    calories:
      (Number(foodEntry.calories_per_100g) * Number(foodEntry.amount)) / 100,
  }
  return values
}

const DiaryPage = () => {
  const { date } = useParams()
  const user = useAuthStore((state) => state.user)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const isValidDate = date ? isValidDateString(date) : false
  const loadFoodEntries = useCallback(async () => {
    if (!date) {
      return
    }
    try {
      const entries = await getFoodEntriesByDate(date)
      setFoodEntries(entries)
      setError("")
    } catch {
      setError("Не удалось загрузить записи")
    } finally {
      setIsLoading(false)
    }
  }, [date])
  useEffect(() => {
    if (date && isValidDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadFoodEntries()
    }
  }, [date, isValidDate, loadFoodEntries])
  if (!date || !isValidDate) {
    return <h1>Неккоректная дата</h1>
  }
  const [year, month, day] = date.split("-")
  const dateStr = `${day}.${month}.${year}`
  const nutritionValuesList: NutritionValues[] = foodEntries.map(
    (foodEntry) => {
      return {
        ...calculateTotalNutritionalValues(foodEntry),
        id: foodEntry.id,
        name: foodEntry.food_name,
        amount: Number(foodEntry.amount),
      }
    },
  )
  const nutritionValuesSum = nutritionValuesList.reduce(
    (acc, item) => ({
      protein: acc?.protein + item?.protein,
      fat: acc?.fat + item?.fat,
      carbs: acc?.carbs + item?.carbs,
      calories: acc?.calories + item?.calories,
    }),
    { protein: 0, fat: 0, carbs: 0, calories: 0 },
  )
  return (
    <div className="w-2xl mx-auto flex flex-col gap-6">
      <ChartPieDonutText
        chartData={[
          {
            name: "protein",
            value: nutritionValuesSum.protein,
            fill: "var(--protein-color)",
          },
          {
            name: "fat",
            value: nutritionValuesSum.fat,
            fill: "var(--fat-color)",
          },
          {
            name: "carbs",
            value: nutritionValuesSum.carbs,
            fill: "var(--carbs-color)",
          },
        ]}
        calories={nutritionValuesSum.calories}
        goal={Number(user?.daily_calories_goal)}
        dateStr={dateStr}
      />
      {isLoading ? (
        <>
          <Skeleton className="w-full h-8" />
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-13" />
            ))}
          </div>
        </>
      ) : nutritionValuesList.length > 0 ? (
        <>
          <AddMealItemDialog date={date} onSuccess={loadFoodEntries} />
          <FoodEntryList
            nutritionValues={nutritionValuesList}
            onSuccessDelete={loadFoodEntries}
          />
        </>
      ) : error ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-destructive/20 text-destructive"
            >
              <CircleX />
            </EmptyMedia>
            <EmptyTitle>Не удалось загрузить записи</EmptyTitle>
            <EmptyDescription>Повторите попытку позже</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={loadFoodEntries}>
              <RefreshCw /> Обновить
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Utensils />
            </EmptyMedia>
            <EmptyTitle>Еще нет записей</EmptyTitle>
            <EmptyDescription>
              Добавьте новую запись о приеме пищи и начните подсчет калорий за
              этот день
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddMealItemDialog date={date} onSuccess={loadFoodEntries} />
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}

export default DiaryPage
