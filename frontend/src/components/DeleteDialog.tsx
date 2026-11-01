import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteFoodEntry } from "@/api/diary"
import { Spinner } from "./ui/spinner"

interface DeleteDialogProps {
  foodName: string
  foodEntryId: string
  onSuccessDelete: () => Promise<void>
}

const DeleteDialog = ({
  foodName,
  foodEntryId,
  onSuccessDelete,
}: DeleteDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const handleDelete = async () => {
    setError("")
    setIsLoading(true)
    try {
      await deleteFoodEntry(foodEntryId)
      setIsDialogOpen(false)
      await onSuccessDelete()
    } catch {
      setError("Не удалось удалить запись")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" />}>
        <Trash className="text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удаление записи</AlertDialogTitle>
          <AlertDialogDescription>
            Вы действительно хотите удалить {foodName}?
          </AlertDialogDescription>
          {error ? <div className="text-destructive text-sm">{error}</div> : ""}
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm">
              <Spinner />
              <span>Удаление</span>
            </div>
          ) : (
            ""
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Да</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog
