import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "@/api/auth"
import axios from "axios"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/store/authStore"
import { getProfile } from "@/api/profile"
import { PATHS } from "@/constants/routes"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await loginUser(username, password)
      const user = await getProfile()
      setUser(user)
      setError("")
      navigate(PATHS.HOME)
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        setError("Неизвестная ошибка")
        return
      } else if (!error.response) {
        setError("Не удалось подключиться к серверу")
        return
      } else if (error.response.status === 400) {
        setError("Неверный логин или пароль")
      } else {
        setError("Не удалось выполнить вход. Попробуйте позже")
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form className="h-[90%] flex items-center" onSubmit={handleSubmit}>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Вход в аккаунт</CardTitle>
          <CardAction>
            <Button variant="link">
              <Link to={PATHS.REGISTER}>Регистрация</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Имя пользователя</FieldLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                autoComplete="username"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                autoComplete="current-password"
                required
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : ""}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Выполняем вход...</span>
              </div>
            ) : (
              ""
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col">
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default LoginPage
