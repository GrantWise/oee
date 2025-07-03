"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"
import { LiveOEEChart } from "@/components/analytics/live-oee-chart"
import { PerformanceHeatmap } from "@/components/analytics/performance-heatmap"
import { DowntimeParetoFrequency } from "@/components/analytics/downtime-pareto-frequency"
import { DowntimeParetoDuration } from "@/components/analytics/downtime-pareto-duration"
import { BarChart3, TrendingUp, Target, AlertTriangle, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function SupervisorAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<"1h" | "4h" | "8h" | "24h">("4h")
  const [selectedMachine, setSelectedMachine] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const machines = [
    { id: "all", name: "All Lines" },
    { id: "line-a", name: "Line A - Packaging" },
    { id: "line-b", name: "Line B - Assembly" },
    { id: "line-c", name: "Line C - Filling" },
    { id: "line-d", name: "Line D - Labeling" },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const primaryColor = "#0f4a7a"
  const secondaryColor = "#f1f5f9"

  return (
    <div className="min-h-screen" style={{ backgroundColor: secondaryColor }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
                Live OEE Analytics
              </h1>
              <Badge variant="outline" className="text-sm">
                Real-Time Data
              </Badge>
            </div>
            <SupervisorNav alertCount={3} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: primaryColor }}>
                Machine:
              </span>
              <div className="flex gap-1">
                {machines.map((machine) => (
                  <Button
                    key={machine.id}
                    variant={selectedMachine === machine.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMachine(machine.id)}
                    style={
                      selectedMachine === machine.id
                        ? { backgroundColor: primaryColor, color: "white", borderColor: primaryColor }
                        : {
                            backgroundColor: "transparent",
                            color: primaryColor,
                            borderColor: primaryColor,
                          }
                    }
                    className="hover:opacity-80 transition-opacity"
                  >
                    {machine.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: primaryColor }}>
                Time Range:
              </span>
              <div className="flex gap-1">
                {(["1h", "4h", "8h", "24h"] as const).map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
                    style={
                      selectedTimeRange === range
                        ? { backgroundColor: primaryColor, color: "white", borderColor: primaryColor }
                        : {
                            backgroundColor: "transparent",
                            color: primaryColor,
                            borderColor: primaryColor,
                          }
                    }
                    className="hover:opacity-80 transition-opacity"
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              backgroundColor: "transparent",
              color: primaryColor,
              borderColor: primaryColor,
            }}
            className="hover:opacity-80 transition-opacity bg-transparent"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 pb-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                CURRENT OEE
                <BarChart3 className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                81.5%
              </div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.3% vs yesterday
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                TARGET ACHIEVEMENT
                <Target className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">96%</div>
              <div className="text-sm text-muted-foreground mt-1">81.5% / 85% target</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                BEST PERFORMER
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold" style={{ color: primaryColor }}>
                Line C
              </div>
              <div className="text-2xl font-bold text-green-600">89.7%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                NEEDS ATTENTION
                <AlertTriangle className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold" style={{ color: primaryColor }}>
                Line A
              </div>
              <div className="text-2xl font-bold text-red-600">78.5%</div>
            </CardContent>
          </Card>
        </div>

        {/* Live OEE Chart */}
        <LiveOEEChart
          machineId={selectedMachine}
          machineName={machines.find((m) => m.id === selectedMachine)?.name || "All Lines"}
          timeRange={selectedTimeRange}
        />

        {/* Performance Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Heatmap */}
          <PerformanceHeatmap />

          {/* Downtime Pareto Charts */}
          <DowntimeParetoFrequency />
          <DowntimeParetoDuration />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: primaryColor }}>Top Downtime Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { reason: "Material Shortage", count: 12, duration: "2.5h", impact: "High" },
                  { reason: "Mechanical Issues", count: 8, duration: "1.8h", impact: "Medium" },
                  { reason: "Operator Break", count: 15, duration: "1.2h", impact: "Low" },
                  { reason: "Quality Issues", count: 5, duration: "0.9h", impact: "Medium" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <div>
                      <div className="font-medium" style={{ color: primaryColor }}>
                        {item.reason}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.count} occurrences</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: primaryColor }}>
                        {item.duration}
                      </div>
                      <Badge
                        variant={
                          item.impact === "High" ? "destructive" : item.impact === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {item.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ color: primaryColor }}>Performance Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Positive Trend</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Line C is trending upward and likely to exceed 90% OEE in the next 2 hours.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">Watch Alert</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Line A performance declining. May need intervention to maintain targets.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Target Forecast</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Overall facility OEE projected to reach 83.2% by end of shift.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
