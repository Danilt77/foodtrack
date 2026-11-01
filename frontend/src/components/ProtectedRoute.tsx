import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { Spinner } from "./ui/spinner"
import { PATHS } from "@/constants/routes"

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user)
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)

  if (isCheckingAuth) {
    return (
      <div className="h-[90%] items-center justify-center flex">
        <Spinner className="size-12" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
