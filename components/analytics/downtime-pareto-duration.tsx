"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts"
import { Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface DowntimeDurationData {
  reason: string
  duration: number
  cumulative: number
  hours: number
}

export function DowntimeParetoDuration() {
  const [data, setData] = useState<DowntimeDurationData[]>([])

  useEffect(() => {
    // Generate downtime duration data (in minutes)
    const downtimeReasons = [
      { reason: "Mechanical Issues", duration: 480 }, // 8 hours
      { reason: "Material Shortage", duration: 360 }, // 6 hours
      { reason: "Setup/Changeover", duration: 240 }, // 4 hours
      { reason: "Quality Issues", duration: 180 }, // 3 hours
      { reason: "Maintenance", duration: 150 }, // 2.5 hours
      { reason: "Tool Change", duration: 90 }, // 1.5 hours
      { reason: "Operator Break", duration: 60 }, // 1 hour
      { reason: "Cleaning", duration: 45 }, // 45 minutes
    ]

    const total = downtimeReasons.reduce((sum, item) => sum + item.duration, 0)
    let cumulative = 0

    const processedData = downtimeReasons.map((item) => {
      cumulative += item.duration
      return {
        reason: item.reason.length > 12 ? item.reason.substring(0, 12) + "..." : item.reason,
        duration: (item.duration / total) * 100,
        cumulative: (cumulative / total) * 100,
        hours: item.duration / 60,
      }
    })

    setData(processedData)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm" style={{ color: "#0f4a7a" }}>
          <Clock className="h-4 w-4" />
          Downtime by Duration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="reason"
                tick={{ fontSize: 10, fill: "#64748b" }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="#94a3b8"
              />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748b" }} stroke="#94a3b8" />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10, fill: "#64748b" }}
                stroke="#94a3b8"
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value: any, name: string) => [
                  name === "duration" ? `${Number(value).toFixed(1)}%` : `${Number(value).toFixed(1)}%`,
                  name === "duration" ? "Duration %" : "Cumulative %",
                ]}
                labelFormatter={(label) => {
                  const item = data.find((d) => d.reason === label)
                  return `${label} (${item?.hours.toFixed(1)}h)`
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar yAxisId="left" dataKey="duration" fill="#eab308" name="duration" radius={[2, 2, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="#0f4a7a"
                strokeWidth={2}
                dot={{ fill: "#0f4a7a", r: 3 }}
                name="cumulative"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Top causes represent 80% of total downtime hours
        </div>
      </CardContent>
    </Card>
  )
}
