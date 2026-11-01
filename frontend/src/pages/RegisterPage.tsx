import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { PATHS } from "@/constants/routes"
import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { getProfile } from "@/api/profile"
import axios from "axios"
import { Spinner } from "@/components/ui/spinner"
import { registerUser } from "@/api/auth"

const RegisterPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    if (username.length < 4) {
      setError("Имя пользователя должно быть не менее 4 символов")
      return
    }
    if (password.length < 8) {
      setError("Пароль должен быть не менее 8 символов")
      return
    }
    setIsLoading(true)
    try {
      await registerUser(username, email, password)
      const user = await getProfile()
      setUser(user)
      setError("")
      navigate(PATHS.CALCULATE)
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        setError("Неизвестная ошибка")
        return
      } else if (!error.response) {
        setError("Не удалось подключиться к серверу")
        return
      } else if (error.response.status === 400) {
        const data = error.response.data
        if (typeof data === "object" && data !== null) {
          setError(Object.values(data).flat().join(" "))
        } else {
          setError("Проверьте введенные данные")
        }
        return
      }
      setError("Не удалось выполнить регистрацию. Попробуйте позже")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="h-[90%] flex items-center">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardAction>
            <Button variant="link">
              <Link to={PATHS.LOGIN}>Уже есть аккаунт</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>
                <span>
                  Имя пользователя <span className="text-destructive">*</span>
                </span>
              </FieldLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="your.email@example.com"
              />
            </Field>
            <Field>
              <FieldLabel>
                <span>
                  Пароль <span className="text-destructive">*</span>
                </span>
              </FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <FieldDescription>Не менее 8 символов</FieldDescription>
            </Field>
            {error ? <FieldError>{error}</FieldError> : ""}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Выполняем регистрацию...</span>
              </div>
            ) : (
              ""
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default RegisterPage
