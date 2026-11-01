import { Link } from "react-router-dom"
import { PATHS } from "@/constants/routes"
import { UserRoundPen } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { logoutUser } from "@/api/auth"

export interface User {
  id: number
  username: string
  email: string
  calories_goal: string
}

const Header = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const handleLogout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Ошибка выхода из аккаунта: ", error)
    }
  }
  return (
    <header className="flex justify-between items-center px-12 py-4">
      <Link
        to={PATHS.HOME}
        className="text-4xl font-bold tracking-tight font-[Outfit_Variable]"
      >
        <span className="text-(--carbs-color)">Food</span>Track
      </Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to={PATHS.PROFILE}>
              <Button variant="link">
                <UserRoundPen />
                {user.username}
              </Button>
            </Link>
            <Button variant="link" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        ) : (
          <Link to={PATHS.LOGIN}>
            <Button variant="link">Войти</Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
