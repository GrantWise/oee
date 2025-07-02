"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Target, Activity } from "lucide-react"
import { useState, useEffect } from "react"

interface OEEDataPoint {
  time: string
  overall: number
  availability: number
  performance: number
  quality: number
  target: number
}

interface LiveOEEChartProps {
  machineId?: string
  machineName?: string
  timeRange?: "1h" | "4h" | "8h" | "24h"
}

export function LiveOEEChart({ machineId = "all", machineName = "All Lines", timeRange = "4h" }: LiveOEEChartProps) {
  const [data, setData] = useState<OEEDataPoint[]>([])
  const [currentOEE, setCurrentOEE] = useState(81.5)

  // Generate initial data
  useEffect(() => {
    const generateInitialData = () => {
      const points = timeRange === "1h" ? 12 : timeRange === "4h" ? 24 : timeRange === "8h" ? 48 : 96
      const interval = timeRange === "1h" ? 5 : timeRange === "4h" ? 10 : timeRange === "8h" ? 10 : 15

      const now = new Date()
      const initialData: OEEDataPoint[] = []

      for (let i = points; i >= 0; i--) {
        const time = new Date(now.getTime() - i * interval * 60 * 1000)
        const baseOEE = 82 + Math.sin(i * 0.1) * 8 + (Math.random() - 0.5) * 6

        initialData.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          overall: Math.max(65, Math.min(95, baseOEE)),
          availability: Math.max(80, Math.min(98, baseOEE + 5 + (Math.random() - 0.5) * 4)),
          performance: Math.max(60, Math.min(95, baseOEE - 3 + (Math.random() - 0.5) * 8)),
          quality: Math.max(95, Math.min(99.5, 98 + (Math.random() - 0.5) * 2)),
          target: 85,
        })
      }

      setData(initialData)
      setCurrentOEE(initialData[initialData.length - 1]?.overall || 81.5)
    }

    generateInitialData()
  }, [timeRange])

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData]
        const lastPoint = newData[newData.length - 1]
        const now = new Date()

        const newOEE = Math.max(65, Math.min(95, lastPoint.overall + (Math.random() - 0.5) * 3))

        const newPoint: OEEDataPoint = {
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          overall: newOEE,
          availability: Math.max(80, Math.min(98, newOEE + 5 + (Math.random() - 0.5) * 4)),
          performance: Math.max(60, Math.min(95, newOEE - 3 + (Math.random() - 0.5) * 8)),
          quality: Math.max(95, Math.min(99.5, 98 + (Math.random() - 0.5) * 2)),
          target: 85,
        }

        newData.push(newPoint)
        setCurrentOEE(newOEE)

        // Keep only recent data points
        const maxPoints = timeRange === "1h" ? 12 : timeRange === "4h" ? 24 : timeRange === "8h" ? 48 : 96
        return newData.slice(-maxPoints)
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [timeRange])

  const getTrend = () => {
    if (data.length < 2) return { direction: "neutral", value: 0 }

    const recent = data.slice(-6).map((d) => d.overall)
    const older = data.slice(-12, -6).map((d) => d.overall)

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length

    const diff = recentAvg - olderAvg

    return {
      direction: diff > 1 ? "up" : diff < -1 ? "down" : "neutral",
      value: Math.abs(diff),
    }
  }

  const trend = getTrend()

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live OEE - {machineName}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">{currentOEE.toFixed(1)}%</div>
                <div className="flex items-center text-sm">
                  {trend.direction === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {trend.direction === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                  {trend.direction === "neutral" && <Target className="h-4 w-4 text-gray-600" />}
                  <span
                    className={`ml-1 ${
                      trend.direction === "up"
                        ? "text-green-600"
                        : trend.direction === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                    {trend.value.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Badge variant={currentOEE >= 85 ? "default" : currentOEE >= 65 ? "secondary" : "destructive"}>
                {currentOEE >= 85 ? "Excellent" : currentOEE >= 65 ? "Good" : "Poor"}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>Target: 85%</div>
            <div>Last {timeRange}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis
                domain={[60, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: "OEE %", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" name="Target" dot={false} />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="#2563eb"
                strokeWidth={3}
                name="Overall OEE"
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="availability"
                stroke="#16a34a"
                strokeWidth={2}
                name="Availability"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#ea580c"
                strokeWidth={2}
                name="Performance"
                dot={false}
              />
              <Line type="monotone" dataKey="quality" stroke="#7c3aed" strokeWidth={2} name="Quality" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
