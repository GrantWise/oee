"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Circle, Clock, Gauge, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MachineStatus } from "@/lib/mock-data"

interface MachineStatusCardProps {
  machine: MachineStatus
  onStatusChange?: (status: string) => void
  showActions?: boolean
  compact?: boolean
}

export function MachineStatusCard({
  machine,
  onStatusChange,
  showActions = true,
  compact = false,
}: MachineStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-600 bg-green-50 border-green-200"
      case "stopped":
        return "text-red-600 bg-red-50 border-red-200"
      case "slow":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "maintenance":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "offline":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return CheckCircle
      case "stopped":
        return Circle
      case "slow":
        return Clock
      case "maintenance":
        return Gauge
      default:
        return Circle
    }
  }

  const StatusIcon = getStatusIcon(machine.status)
  const statusClass = getStatusColor(machine.status)

  return (
    <Card className={cn("transition-all duration-200", `border-l-4 ${statusClass}`, compact ? "p-4" : "p-6")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={compact ? "text-base" : "text-lg"}>{machine.name}</CardTitle>
          <Badge className={cn("text-xs font-semibold", statusClass)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {machine.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* OEE Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Availability</div>
            <div
              className={cn(
                "font-bold",
                compact ? "text-lg" : "text-xl",
                machine.oee.availability >= 90
                  ? "text-green-600"
                  : machine.oee.availability >= 80
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {machine.oee.availability.toFixed(0)}%
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Performance</div>
            <div
              className={cn(
                "font-bold",
                compact ? "text-lg" : "text-xl",
                machine.oee.performance >= 90
                  ? "text-green-600"
                  : machine.oee.performance >= 80
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {machine.oee.performance.toFixed(0)}%
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Quality</div>
            <div
              className={cn(
                "font-bold",
                compact ? "text-lg" : "text-xl",
                machine.oee.quality >= 95
                  ? "text-green-600"
                  : machine.oee.quality >= 90
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {machine.oee.quality.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Overall OEE */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Overall OEE</div>
          <div
            className={cn(
              "text-3xl font-black tabular-nums",
              machine.oee.overall >= 85
                ? "text-green-600"
                : machine.oee.overall >= 65
                  ? "text-amber-600"
                  : "text-red-600",
            )}
          >
            {machine.oee.overall.toFixed(1)}%
          </div>
        </div>

        {/* Production Rate */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Production Rate:</span>
          <span className="font-semibold">
            {machine.productionRate.current} / {machine.productionRate.target} {machine.productionRate.unit}
          </span>
        </div>

        {/* Current Order */}
        {machine.currentOrder && (
          <div className="text-sm">
            <div className="text-muted-foreground">Current Order:</div>
            <div className="font-semibold">{machine.currentOrder.orderNumber}</div>
            <div className="text-xs text-muted-foreground">
              {machine.currentOrder.quantity} / {machine.currentOrder.targetQuantity} units
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-h-[44px] bg-transparent"
              onClick={() => onStatusChange?.("maintenance")}
            >
              Maintenance
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-h-[44px] bg-transparent"
              onClick={() => onStatusChange?.("stopped")}
            >
              Stop
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
