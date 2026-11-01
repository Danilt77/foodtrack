"use client"

import * as React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

interface ChartPieDonutTextProps {
  chartData: itemData[]
  calories: number
  goal: number
  dateStr: string
}

interface itemData {
  name: string
  value: number
  fill: string
}

const chartConfig = {
  protein: {
    label: "Белки",
  },
  fat: {
    label: "Жиры",
  },
  carbs: {
    label: "Углеводы",
  },
  left: {
    label: "Осталось",
  },
  other: {
    label: "Прочее",
  },
} satisfies ChartConfig

export function ChartPieDonutText({
  chartData,
  calories,
  goal,
  dateStr,
}: ChartPieDonutTextProps) {
  const totalValue = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => acc + curr.value * (curr.name === "fat" ? 9 : 4),
      0,
    )
  }, [chartData])
  const caloriesLeft = goal - calories
  const outputData = [
    ...chartData.map((item) => ({
      ...item,
      value: item.value * (item.name === "fat" ? 9 : 4),
    })),
    {
      name: "other",
      value: calories - totalValue > 1 ? calories - totalValue : 0,
      fill: "var(--chart-2)",
    },
    {
      name: "left",
      value: caloriesLeft > 0 ? caloriesLeft : 0,
      fill: "var(--muted)",
    },
  ]
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Рацион на {dateStr}</CardTitle>
        <CardDescription>Цель: {goal} ккал</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={outputData}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {chartData.map((item, index) => (
                          <tspan
                            key={item.name}
                            x={viewBox.cx - (index - 1) * -64}
                            y={(viewBox.cy || 0) - 112}
                            className="text-sm opacity-80 font-bold"
                            style={{ fill: item.fill }}
                          >
                            {Math.round(item.value)} г
                          </tspan>
                        ))}
                        {/* </tspan> */}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="flex gap-4 fill-foreground text-3xl font-bold"
                        >
                          {Math.round(calories).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          ккал
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {Math.round(caloriesLeft) === 0 ? (
            ""
          ) : caloriesLeft > 0 ? (
            <ArrowDown className="size-4" />
          ) : (
            <ArrowUp className="size-4" />
          )}
          {Math.round((calories / goal) * 100)}%
        </div>
        <div className="leading-none text-muted-foreground">
          {caloriesLeft >= 0
            ? `До цели: ${Math.round(caloriesLeft)} ккал`
            : `Избыток: ${Math.round(-caloriesLeft)} ккал`}
        </div>
      </CardFooter>
    </Card>
  )
}
