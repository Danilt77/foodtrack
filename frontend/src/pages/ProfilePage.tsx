import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"
import { updateUserField, type UserField } from "@/api/profile"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { RefreshCw } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"
import { Field, FieldError } from "@/components/ui/field"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/constants/routes"

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [editableField, setEditableField] = useState<UserField | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [usernameValue, setUsernameValue] = useState(user?.username ?? "")
  const [caloriesValue, setCaloriesValue] = useState(
    Number(user?.daily_calories_goal ?? "").toString(),
  )
  const [emailValue, setEmailValue] = useState(user?.email ?? "")
  const navigate = useNavigate()
  if (!user) {
    return (
      <div className="h-[90%] flex flex-col gap-4 items-center justify-center">
        <span>
          Не удалось получить данные пользователя. Повторите попытку позже
        </span>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw /> Обновить страницу
        </Button>
      </div>
    )
  }
  const handleUpdate = async (field: UserField, value: string | number) => {
    if (field === "username" && usernameValue.length < 4) {
      setError("Имя пользователя должно быть не менее 4 символов")
      return
    }
    if (
      (field === "daily_calories_goal" && Number(caloriesValue) < 100) ||
      Number(caloriesValue) > 10000
    ) {
      setError("Значение должно быть в пределах от 100 до 10000")
      return
    }
    setIsLoading(true)
    try {
      const updatedUser = await updateUserField(field, value)
      setUser(updatedUser)
      setIsLoading(false)
      setEditableField("")
      setError("")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("Не удалось подключиться к серверу")
          return
        }
        const serverError = error.response?.data[editableField]
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
          <CardTitle>Настройки профиля</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_1fr_1fr] gap-x-2 gap-y-4 items-center">
          <div className="text-muted-foreground">Имя пользователя:</div>
          {editableField === "username" ? (
            <>
              <Field>
                <Input
                  value={usernameValue}
                  onChange={(e) => setUsernameValue(e.target.value)}
                  className="h-7"
                  aria-invalid={Boolean(error)}
                />
                {error ? <FieldError>{error}</FieldError> : ""}
              </Field>
              <Button
                size="sm"
                onClick={() => handleUpdate("username", usernameValue)}
              >
                {isLoading ? <Spinner /> : "Сохранить"}
              </Button>
            </>
          ) : (
            <>
              <div>{user?.username}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditableField("username")
                }}
              >
                Изменить
              </Button>
            </>
          )}
          <div className="text-muted-foreground">Цель калорий в день:</div>
          {editableField === "daily_calories_goal" ? (
            <>
              <Field>
                <Input
                  type="number"
                  value={caloriesValue}
                  onChange={(e) => setCaloriesValue(e.target.value)}
                  className="h-7"
                  aria-invalid={Boolean(error)}
                />
                {error ? <FieldError>{error}</FieldError> : ""}
              </Field>
              <Button
                size="sm"
                onClick={() =>
                  handleUpdate("daily_calories_goal", caloriesValue)
                }
              >
                {isLoading ? <Spinner /> : "Сохранить"}
              </Button>
            </>
          ) : (
            <>
              <div>{Number(user?.daily_calories_goal).toString()} ккал</div>
              <ButtonGroup className="w-full">
                <Button
                  onClick={() => navigate(PATHS.CALCULATE)}
                  size="sm"
                  className="grow"
                >
                  Рассчитать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditableField("daily_calories_goal")
                  }}
                >
                  Изменить
                </Button>
              </ButtonGroup>
            </>
          )}
          <div className="text-muted-foreground">Email:</div>
          {editableField === "email" ? (
            <>
              <Field>
                <Input
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="h-7"
                  aria-invalid={Boolean(error)}
                />
                {error ? <FieldError>{error}</FieldError> : ""}
              </Field>
              <Button
                size="sm"
                onClick={() => handleUpdate("email", emailValue)}
              >
                {isLoading ? <Spinner /> : "Сохранить"}
              </Button>
            </>
          ) : (
            <>
              <div>{user?.email ? user?.email : "Не указан"}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditableField("email")
                }}
              >
                Изменить
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
