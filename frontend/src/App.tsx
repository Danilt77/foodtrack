import Header from "@/components/Header"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Routes, Route } from "react-router-dom"
import { PATHS } from "@/constants/routes"
import CalendarPage from "@/pages/CalendarPage"
import DiaryPage from "@/pages/DiaryPage"
import { useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import { useAuthStore } from "@/store/authStore"
import ProtectedRoute from "@/components/ProtectedRoute"
import RegisterPage from "@/pages/RegisterPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"
import CalculateCaloriesPage from "@/pages/CalculateCaloriesPage"

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col h-screen max-h-screen">
          <Header />
          <main className="flex-1 px-12 py-4">
            <Routes>
              <Route path={PATHS.LOGIN} element={<LoginPage />} />
              <Route path={PATHS.REGISTER} element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path={PATHS.HOME} element={<CalendarPage />} />
                <Route path={`${PATHS.DIARY}/:date`} element={<DiaryPage />} />
                <Route path={PATHS.PROFILE} element={<ProfilePage />} />
                <Route
                  path={PATHS.CALCULATE}
                  element={<CalculateCaloriesPage />}
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
