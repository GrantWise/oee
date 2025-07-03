"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts"
import { TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"

interface DowntimeData {
  reason: string
  frequency: number
  cumulative: number
  percentage: number
}

export function DowntimeParetoFrequency() {
  const [data, setData] = useState<DowntimeData[]>([])

  useEffect(() => {
    // Generate downtime frequency data
    const downtimeReasons = [
      { reason: "Material Shortage", frequency: 45 },
      { reason: "Mechanical Issues", frequency: 32 },
      { reason: "Quality Issues", frequency: 28 },
      { reason: "Operator Break", frequency: 24 },
      { reason: "Setup/Changeover", frequency: 18 },
      { reason: "Tool Change", frequency: 15 },
      { reason: "Cleaning", frequency: 12 },
      { reason: "Maintenance", frequency: 8 },
    ]

    const total = downtimeReasons.reduce((sum, item) => sum + item.frequency, 0)
    let cumulative = 0

    const processedData = downtimeReasons.map((item) => {
      cumulative += item.frequency
      return {
        reason: item.reason.length > 12 ? item.reason.substring(0, 12) + "..." : item.reason,
        frequency: item.frequency,
        cumulative: (cumulative / total) * 100,
        percentage: (item.frequency / total) * 100,
      }
    })

    setData(processedData)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm" style={{ color: "#0f4a7a" }}>
          <TrendingDown className="h-4 w-4" />
          Downtime by Frequency
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
                  name === "frequency" ? `${value} events` : `${Number(value).toFixed(1)}%`,
                  name === "frequency" ? "Frequency" : "Cumulative %",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar yAxisId="left" dataKey="frequency" fill="#dc2626" name="frequency" radius={[2, 2, 0, 0]} />
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
          Top causes represent 80% of all downtime events
        </div>
      </CardContent>
    </Card>
  )
}
