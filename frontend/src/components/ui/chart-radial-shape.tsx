"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

interface ChartRadialShapeProps {
  chartData: { calories: number; fill: string }[]
  caloriesGoal: number
}

const chartConfig = {
  calories: {
    label: "Calories",
  },
} satisfies ChartConfig

export function ChartRadialShape({
  chartData,
  caloriesGoal,
}: ChartRadialShapeProps) {
  const endAngle = (chartData[0].calories / caloriesGoal) * 360
  return (
    <div className="flex-1 scale-50 md:scale-75 lg:scale-100 h-full lg:h-auto">
      <ChartContainer
        config={chartConfig}
        className="mx-auto overflow-clip max-h-[250px] min-h-full lg:min-h-0"
      >
        <RadialBarChart
          data={chartData}
          endAngle={endAngle}
          innerRadius={35}
          outerRadius={55}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[51, 39]}
          />
          <RadialBar dataKey="calories" background />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {Math.round(chartData[0].calories).toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        className="fill-muted-foreground text-xs"
                      >
                        ккал
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}
