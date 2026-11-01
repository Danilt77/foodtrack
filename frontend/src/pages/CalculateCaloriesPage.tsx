import { updateUserField } from "@/api/profile"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
  FieldContent,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { PATHS } from "@/constants/routes"
import { useAuthStore } from "@/store/authStore"
import axios from "axios"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

interface FormData {
  weight: string
  height: string
  age: string
  goal: string
  phys: string
  gender: string
}

const calculateDailyCalories = (data: FormData) => {
  const {
    weight: w,
    height: h,
    age: a,
    gender: c,
    phys: k,
    goal: g,
  } = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, Number(value)]),
  )
  if (w < 0 || w > 1000 || h < 50 || h > 300 || a < 0 || a > 150) {
    return null
  }
  return Math.round((10 * w + 6.25 * h - 5 * a + c) * k * g)
}

const CalculateCaloriesPage = () => {
  const [formData, setFormData] = useState<FormData>({
    weight: "",
    height: "",
    age: "",
    gender: "",
    phys: "",
    goal: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const calories = useMemo(() => {
    return calculateDailyCalories(formData)
  }, [formData])
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    console.log(formData)
  }
  const handleSave = async () => {
    setError("")
    if (calories === null) {
      setError("Проверьте корректность введенных данных")
      return
    }
    setIsLoading(true)
    try {
      const updatedUser = await updateUserField("daily_calories_goal", calories)
      setUser(updatedUser)
      setIsLoading(false)
      setError("")
      navigate(PATHS.PROFILE)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Не удалось подключиться к серверу")
          return
        }
        const serverError = error.response?.data["daily_calories_goal"]
        if (Array.isArray(serverError)) {
          setError(serverError[0])
        } else if (typeof serverError === "string") {
          setError(serverError)
        } else {
          setError("Не удалось изменить данные")
        }
      } else {
        setError("Неизвестная ошибка")
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="h-[90%] flex items-center">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Рассчет дневной нормы калорий</CardTitle>
          <CardDescription>
            Заполните все поля, чтобы рассчитать вашу норму калорий
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="weight">Вес</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    id="weight"
                  />
                  <InputGroupAddon align="inline-end">кг</InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="height">Рост</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    id="height"
                  />
                  <InputGroupAddon align="inline-end">см</InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="age">Возраст</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    id="age"
                  />
                  <InputGroupAddon align="inline-end">лет</InputGroupAddon>
                </InputGroup>
              </Field>
              <FieldSet>
                <FieldLegend>Цель</FieldLegend>
                <FieldDescription>
                  Что вы хотите сделать с весом
                </FieldDescription>
                <RadioGroup
                  value={formData.goal}
                  onValueChange={(value) => handleChange("goal", value)}
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="0.85" id="lose" />
                    <FieldLabel htmlFor="lose">Похудеть</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1.1" id="gain" />
                    <FieldLabel htmlFor="gain">Набрать</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1" id="maintenance" />
                    <FieldLabel htmlFor="maintenance">Поддерживать</FieldLabel>
                  </Field>
                </RadioGroup>
              </FieldSet>
            </FieldGroup>
            <Separator orientation="vertical" />
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Физическая активность</FieldLegend>
                <RadioGroup
                  value={formData.phys}
                  onValueChange={(value) => handleChange("phys", value)}
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1.2" id="phys0" />
                    <FieldContent>
                      <FieldLabel htmlFor="phys0">Минимальная</FieldLabel>
                      <FieldDescription>почти без нагрузок</FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1.375" id="phys1" />
                    <FieldContent>
                      <FieldLabel htmlFor="phys1">Легкая</FieldLabel>
                      <FieldDescription>
                        тренировки 1-3 раза в неделю
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1.55" id="phys2" />
                    <FieldContent>
                      <FieldLabel htmlFor="phys2">Умеренная</FieldLabel>
                      <FieldDescription>
                        тренировки 3-5 раз в неделю
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1.725" id="phys3" />
                    <FieldContent>
                      <FieldLabel htmlFor="phys3" className="block">
                        Высокая
                      </FieldLabel>
                      <FieldDescription>
                        тренировки 6-7 раз в неделю
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="1.9" id="phys4" />
                    <FieldContent>
                      <FieldLabel htmlFor="phys4">Очень высокая</FieldLabel>
                      <FieldDescription>тяжелые нагрузки</FieldDescription>
                    </FieldContent>
                  </Field>
                </RadioGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend>Пол</FieldLegend>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="5" id="male" />
                    <FieldLabel htmlFor="male">Мужской</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="-161" id="female" />
                    <FieldLabel htmlFor="female">Женский</FieldLabel>
                  </Field>
                </RadioGroup>
              </FieldSet>
            </FieldGroup>
          </div>
          <div className="w-full flex gap-2 items-center">
            {isLoading ? (
              <>
                <Spinner /> Сохранение...
              </>
            ) : error ? (
              <FieldError>{error}</FieldError>
            ) : (
              ""
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <CardDescription className="w-full">
            {calories !== null ? (
              <>
                <span>Итог:</span>{" "}
                <span className="text-foreground">
                  {calories?.toLocaleString()} ккал
                </span>
              </>
            ) : (
              "Заполните все поля корректно, чтобы узнать результат"
            )}
          </CardDescription>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => navigate(PATHS.PROFILE)}
              className="grow flex-1"
            >
              Ввести вручную
            </Button>
            <Button onClick={handleSave} className="grow flex-1">
              Сохранить
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CalculateCaloriesPage
