"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface HeatmapData {
  hour: number
  day: string
  value: number
  status: "excellent" | "good" | "poor"
}

export function PerformanceHeatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])

  useEffect(() => {
    // Generate heatmap data for the last 7 days, 24 hours each
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const data: HeatmapData[] = []

    days.forEach((day) => {
      for (let hour = 0; hour < 24; hour++) {
        // Simulate realistic OEE patterns (lower at night, higher during day shift)
        let baseValue = 75
        if (hour >= 6 && hour <= 14)
          baseValue = 85 // Day shift
        else if (hour >= 14 && hour <= 22)
          baseValue = 80 // Evening shift
        else baseValue = 70 // Night shift

        // Add some randomness and day-of-week effects
        const dayEffect = day === "Mon" ? -5 : day === "Fri" ? -3 : 0
        const randomEffect = (Math.random() - 0.5) * 20

        const value = Math.max(50, Math.min(95, baseValue + dayEffect + randomEffect))

        data.push({
          hour,
          day,
          value,
          status: value >= 85 ? "excellent" : value >= 65 ? "good" : "poor",
        })
      }
    })

    setHeatmapData(data)
  }, [])

  const getColorClass = (status: string, value: number) => {
    const intensity = Math.min(1, Math.max(0.3, value / 100))

    switch (status) {
      case "excellent":
        return {
          backgroundColor: `rgba(34, 197, 94, ${intensity})`,
          border: "1px solid rgba(34, 197, 94, 0.3)",
        }
      case "good":
        return {
          backgroundColor: `rgba(234, 179, 8, ${intensity})`,
          border: "1px solid rgba(234, 179, 8, 0.3)",
        }
      case "poor":
        return {
          backgroundColor: `rgba(239, 68, 68, ${intensity})`,
          border: "1px solid rgba(239, 68, 68, 0.3)",
        }
      default:
        return {
          backgroundColor: "#f1f5f9",
          border: "1px solid #e2e8f0",
        }
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2" style={{ color: "hsl(220 87% 32%)" }}>
            <Calendar className="h-5 w-5" />
            Performance Heatmap - Last 7 Days
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>≥85%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>65-84%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>&lt;65%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Hour labels - much more compact */}
          <div className="flex items-center gap-0.5">
            <div className="w-8 text-xs"></div> {/* Space for day labels */}
            {hours.map((hour) => (
              <div key={hour} className="w-3 text-xs text-center text-muted-foreground" style={{ fontSize: "10px" }}>
                {hour % 6 === 0
                  ? hour === 0
                    ? "12a"
                    : hour === 12
                      ? "12p"
                      : hour > 12
                        ? `${hour - 12}p`
                        : `${hour}a`
                  : ""}
              </div>
            ))}
          </div>

          {/* Heatmap grid - very dense */}
          {days.map((day) => (
            <div key={day} className="flex items-center gap-0.5">
              <div
                className="w-8 text-xs font-medium text-muted-foreground flex items-center justify-end pr-1"
                style={{ color: "hsl(220 87% 32%)" }}
              >
                {day}
              </div>
              {hours.map((hour) => {
                const dataPoint = heatmapData.find((d) => d.day === day && d.hour === hour)
                if (!dataPoint) {
                  return (
                    <div
                      key={hour}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-all"
                      style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                    />
                  )
                }

                const style = getColorClass(dataPoint.status, dataPoint.value)
                return (
                  <div
                    key={hour}
                    className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110 hover:z-10 relative"
                    style={style}
                    title={`${day} ${hour}:00 - ${dataPoint.value.toFixed(1)}% OEE`}
                  />
                )
              })}
            </div>
          ))}

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {heatmapData.filter((d) => d.status === "excellent").length}
              </div>
              <div className="text-sm text-muted-foreground">Excellent Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {heatmapData.filter((d) => d.status === "good").length}
              </div>
              <div className="text-sm text-muted-foreground">Good Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {heatmapData.filter((d) => d.status === "poor").length}
              </div>
              <div className="text-sm text-muted-foreground">Poor Hours</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
