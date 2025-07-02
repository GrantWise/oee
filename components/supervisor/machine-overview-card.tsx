"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Circle, Clock, CheckCircle, AlertTriangle, User, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MachineStatus, ProductionOrder } from "@/lib/mock-data"
import { MachineTimeline } from "./machine-timeline"

interface MachineOverviewCardProps {
  machine: MachineStatus & { currentOrder?: ProductionOrder }
  operator?: {
    name: string
    status: string
    skillLevel: string
  }
  alerts?: number
  onViewDetails?: () => void
  onContactOperator?: () => void
  onViewAlerts?: () => void
}

export function MachineOverviewCard({
  machine,
  operator,
  alerts = 0,
  onViewDetails,
  onContactOperator,
  onViewAlerts,
}: MachineOverviewCardProps) {
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
      default:
        return Circle
    }
  }

  const getOeeColor = (oee: number) => {
    if (oee >= 85) return "text-green-600"
    if (oee >= 65) return "text-amber-600"
    return "text-red-600"
  }

  const getProductionProgress = () => {
    if (!machine.currentOrder) return 0
    return (machine.currentOrder.quantity / machine.currentOrder.targetQuantity) * 100
  }

  const StatusIcon = getStatusIcon(machine.status)
  const statusClass = getStatusColor(machine.status)

  // Add timeline rendering function

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", `border-l-4 ${statusClass}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{machine.name}</CardTitle>
          <div className="flex items-center gap-2">
            {alerts > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewAlerts}
                className="text-red-600 border-red-200 bg-transparent"
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                {alerts}
              </Button>
            )}
            <Badge className={cn("text-xs font-semibold", statusClass)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {machine.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* OEE Metrics Row */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Overall</div>
            <div className={cn("text-xl font-bold", getOeeColor(machine.oee.overall))}>
              {machine.oee.overall.toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Avail</div>
            <div className={cn("text-lg font-semibold", getOeeColor(machine.oee.availability))}>
              {machine.oee.availability.toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Perf</div>
            <div className={cn("text-lg font-semibold", getOeeColor(machine.oee.performance))}>
              {machine.oee.performance.toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Qual</div>
            <div className={cn("text-lg font-semibold", getOeeColor(machine.oee.quality))}>
              {machine.oee.quality.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Production Rate */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Rate:</span>
          <span className="font-semibold">
            {machine.productionRate.current} / {machine.productionRate.target} {machine.productionRate.unit}
          </span>
        </div>

        {/* Current Order */}
        {machine.currentOrder && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Order:</span>
              <span className="font-semibold">{machine.currentOrder.orderNumber}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{machine.currentOrder.productName}</span>
                <span>{getProductionProgress().toFixed(0)}%</span>
              </div>
              <Progress value={getProductionProgress()} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {machine.currentOrder.quantity.toLocaleString()} /{" "}
                {machine.currentOrder.targetQuantity.toLocaleString()} units
              </div>
            </div>
          </div>
        )}

        {/* Machine Timeline - positioned after current order, before operator info */}
        <MachineTimeline machineId={machine.id} timeRange={4} height="sm" showLabels={false} />

        {/* Operator Info */}
        {operator && (
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{operator.name}</span>
              <Badge variant="outline" className="text-xs">
                {operator.skillLevel}
              </Badge>
            </div>
            <Badge variant={operator.status === "active" ? "default" : "secondary"} className="text-xs">
              {operator.status}
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1 bg-transparent">
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={onContactOperator} className="flex-1 bg-transparent">
            <MessageSquare className="mr-1 h-3 w-3" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
