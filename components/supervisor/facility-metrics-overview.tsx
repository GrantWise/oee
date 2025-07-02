"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, Target, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FacilityMetrics } from "@/lib/supervisor-data"

interface FacilityMetricsOverviewProps {
  metrics: FacilityMetrics
  className?: string
}

export function FacilityMetricsOverview({ metrics, className }: FacilityMetricsOverviewProps) {
  const getOeeColor = (oee: number) => {
    if (oee >= 85) return "text-green-600"
    if (oee >= 65) return "text-amber-600"
    return "text-red-600"
  }

  const getProductionProgress = () => {
    return (metrics.totalUnitsProduced / metrics.totalUnitsTarget) * 100
  }

  const getSpeedEfficiency = () => {
    return (metrics.averageLineSpeed / metrics.targetLineSpeed) * 100
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Overall OEE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            OVERALL OEE
            <Activity className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className={cn("text-3xl font-bold", getOeeColor(metrics.overallOEE))}>
              {metrics.overallOEE.toFixed(1)}%
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.3% vs yesterday
            </div>
            <div className="text-xs text-muted-foreground">Target: 85% • Shift Avg: 79.2%</div>
          </div>
        </CardContent>
      </Card>

      {/* Production Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            PRODUCTION PROGRESS
            <Target className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{getProductionProgress().toFixed(0)}%</div>
            <Progress value={getProductionProgress()} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {metrics.totalUnitsProduced.toLocaleString()} / {metrics.totalUnitsTarget.toLocaleString()} units
            </div>
            <div className="flex items-center text-sm text-amber-600">
              <TrendingDown className="mr-1 h-3 w-3" />
              Behind schedule
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            LINE STATUS
            <div className="flex items-center gap-1">
              {metrics.criticalAlerts > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {metrics.activeLines}/{metrics.totalLines}
            </div>
            <div className="text-sm text-muted-foreground">Lines Active</div>
            {metrics.criticalAlerts > 0 && (
              <Badge variant="destructive" className="text-xs">
                {metrics.criticalAlerts} Critical Alert{metrics.criticalAlerts > 1 ? "s" : ""}
              </Badge>
            )}
            <div className="text-xs text-green-600">All lines operational</div>
          </div>
        </CardContent>
      </Card>

      {/* Speed Efficiency */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            SPEED EFFICIENCY
            <Activity className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div
              className={cn(
                "text-3xl font-bold",
                getSpeedEfficiency() >= 90
                  ? "text-green-600"
                  : getSpeedEfficiency() >= 80
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {getSpeedEfficiency().toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Avg: {metrics.averageLineSpeed.toFixed(0)} / {metrics.targetLineSpeed.toFixed(0)} units/hr
            </div>
            <div className="flex items-center text-sm text-amber-600">
              <TrendingDown className="mr-1 h-3 w-3" />
              -5% vs target
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
