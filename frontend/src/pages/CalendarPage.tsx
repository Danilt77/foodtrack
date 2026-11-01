import { Calendar } from "@/components/ui/calendar"
import { ru } from "react-day-picker/locale"

const CalendarPage = () => {
  return <Calendar mode="single" locale={ru} />
}

export default CalendarPage
