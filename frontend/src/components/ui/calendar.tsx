import * as React from "react"
import { cn } from "cn"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/constants/routes"
import { getDailyFoodLogs } from "@/api/diary"
// import { itemAxisPredicate } from "recharts/types/state/selectors/axisSelectors"
import { ChartRadialShape } from "@/components/ui/chart-radial-shape"
import { useAuthStore } from "@/store/authStore"

interface DailyFoodLog {
  id: string
  date: string
  total_calories: string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  const [filledDates, setFilledDates] = React.useState<Map<string, string>>(
    new Map(),
  )

  React.useEffect(() => {
    const loadDailyFoodLogs = async () => {
      try {
        const logs: DailyFoodLog[] = await getDailyFoodLogs()
        setFilledDates(
          new Map(logs.map((item) => [item.date, item.total_calories])),
        )
      } catch {
        console.error("Не удалось загрузить календарь")
      }
    }
    loadDailyFoodLogs()
  }, [])

  return (
    <DayPicker
      fixedWeeks
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("flex flex-col w-full h-full min-h-0", defaultClassNames.root),
        months: cn(
          "relative h-full flex flex-col gap-4 md:flex-row min-h-0",
          defaultClassNames.months,
        ),
        month: cn(
          "flex flex-1 w-full h-full flex-col gap-4 min-h-0",
          defaultClassNames.month,
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-center gap-32",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label,
        ),
        month_grid: cn(
          "w-full h-full border-collapse flex-1",
          defaultClassNames.month_grid,
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday,
        ),
        week: cn(
          "flex w-full border-b last:border-none",
          defaultClassNames.week,
        ),
        weeks: cn(
          "grid w-full h-full grid-rows-[repeat(6,minmax(0,1fr))] min-h-0",
          defaultClassNames.weeks,
        ),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "border-r-1 group/day relative h-full w-full p-0 text-left select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) [&:last-child]:border-r-0",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day,
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end,
        ),
        today: cn(
          "bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        day_button: cn(
          "h-full w-full justify-end items-start px-4 py-2",
          defaultClassNames.day_button,
        ),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton
            locale={locale}
            filledDates={filledDates}
            {...props}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  filledDates,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> } & {
  filledDates: Map<string, string>
}) {
  const defaultClassNames = getDefaultClassNames()

  const navigate = useNavigate()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  // const isFilled = filledDates?.has(day.isoDate)
  const totalCalories = filledDates?.get(day.isoDate)
  const caloriesGoal =
    useAuthStore((state) => state.user?.daily_calories_goal) || 0

  const chartColor =
    Number(totalCalories) / Number(caloriesGoal) > 1.1
      ? "var(--destructive)"
      : "var(--carbs-color)"

  return (
    <Button
      variant="ghost"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // isFilled
        //   ? "bg-(--carbs-color)/25 dark:hover:bg-(--carbs-color)/50 hover:bg-(--carbs-color)/50"
        //   : "",
        "rounded-none relative isolate z-10 flex size-auto w-full h-full min-h-0 min-w-0 flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        navigate(`${PATHS.DIARY}/${day.isoDate}`)
      }}
    >
      {props.children}
      {totalCalories ? (
        <div className="absolute flex w-full h-full top-0 left-0 justify-center items-center font-bold">
          {/* {Math.round(Number(totalCalories))} ккал */}
          <ChartRadialShape
            chartData={[
              {
                calories: Number(totalCalories),
                fill: chartColor,
              },
            ]}
            caloriesGoal={Number(caloriesGoal)}
          />
        </div>
      ) : (
        ""
      )}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
