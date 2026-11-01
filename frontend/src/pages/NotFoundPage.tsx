import { Separator } from "@/components/ui/separator"

const NotFoundPage = () => {
  return (
    <div className="h-[90%] flex items-center justify-center">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <Separator orientation="vertical" />
        <p>Страница не найдена</p>
      </div>
    </div>
  )
}

export default NotFoundPage
