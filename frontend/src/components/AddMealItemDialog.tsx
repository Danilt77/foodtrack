import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "./ui/input-group"
import { useState } from "react"
import { createFoodEntry } from "@/api/diary"
import axios from "axios"
import { Spinner } from "@/components/ui/spinner"
import { Plus } from "lucide-react"

interface AddMealItemDialogProps {
  date: string
  onSuccess: () => Promise<void>
}

interface FormData {
  food_name: string
  protein_per_100g: string
  fat_per_100g: string
  carbs_per_100g: string
  calories_per_100g: string
  amount: string
}

const calculateCalories = (p: number, f: number, c: number): number => {
  return p * 4 + f * 9 + c * 4
}

const initialFormData = {
  food_name: "",
  protein_per_100g: "",
  fat_per_100g: "",
  carbs_per_100g: "",
  calories_per_100g: "",
  amount: "",
}

const validateFormData = (formData: FormData) => {
  if (!formData.food_name.trim()) return "Введите корректное название продукта"

  const p = Number(formData.protein_per_100g)
  const f = Number(formData.fat_per_100g)
  const c = Number(formData.carbs_per_100g)

  if (p + f + c > 100) {
    return "Сумма БЖУ не может превышать 100 г"
  }

  const calculatedCalories = calculateCalories(p, f, c)
  const calories = Number(formData.calories_per_100g)
  if (calories < calculatedCalories) {
    return `Калорийность не может быть меньше ${Math.round(calculatedCalories * 100) / 100} ккал`
  }
  return ""
}

const AddMealItemDialog = ({ date, onSuccess }: AddMealItemDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (["protein_per_100g", "fat_per_100g", "carbs_per_100g"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        calories_per_100g: String(
          Math.round(
            calculateCalories(
              Number(prev.protein_per_100g),
              Number(prev.fat_per_100g),
              Number(prev.carbs_per_100g),
            ) * 100,
          ) / 100,
        ),
      }))
    }
  }
  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    const error = validateFormData(formData)
    if (error) {
      setError(error)
      return
    }
    const entryData = { ...formData, date }
    setIsLoading(true)
    try {
      await createFoodEntry(entryData)
      setFormData(initialFormData)
      setError("")
      setIsDialogOpen(false)
      await onSuccess()
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        setError("Неизестная ошибка")
      } else if (!error.response) {
        setError("Не удалось подключиться к серверу")
      } else if (error.response.status === 400) {
        setError("Проверьте введенные данные")
      } else {
        setError("Не удалось добавить запись. Попробуйте позже")
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus />
            Добавить продукт
          </Button>
        }
      />
      <DialogContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Добавление продукта</DialogTitle>
          </DialogHeader>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="food-name">Название</FieldLabel>
              <Input
                id="food-name"
                name="food_name"
                value={formData.food_name}
                onChange={handleChange}
                placeholder="Продукт"
                required
              />
            </Field>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldDescription>Пищевая ценность на 100 г</FieldDescription>
            <FieldGroup>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="protein">Белки</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      id="protein"
                      name="protein_per_100g"
                      value={formData.protein_per_100g}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>г</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="fat">Жиры</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      id="fat"
                      name="fat_per_100g"
                      value={formData.fat_per_100g}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>г</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="carbs">Углеводы</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      id="carbs"
                      name="carbs_per_100g"
                      value={formData.carbs_per_100g}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>г</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="calories">Калорийность</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    id="calories"
                    name="calories_per_100g"
                    value={formData.calories_per_100g}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="900"
                    step="0.01"
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>ккал</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="amount">Количество</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="10000"
                  step="0.01"
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>г</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          {error ? <FieldError>{error}</FieldError> : ""}
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner /> <span>Добавляем запись...</span>
            </div>
          ) : (
            ""
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Отмена</Button>} />
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMealItemDialog
