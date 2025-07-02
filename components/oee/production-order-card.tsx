"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Package, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductionOrder } from "@/lib/mock-data"

interface ProductionOrderCardProps {
  order: ProductionOrder
  onSelect?: (order: ProductionOrder) => void
  onStart?: (order: ProductionOrder) => void
  selected?: boolean
  disabled?: boolean
}

export function ProductionOrderCard({
  order,
  onSelect,
  onStart,
  selected = false,
  disabled = false,
}: ProductionOrderCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDueDate = (date: Date) => {
    const now = new Date()
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffHours < 0) return "Overdue"
    if (diffHours < 24) return `${diffHours}h remaining`
    const diffDays = Math.ceil(diffHours / 24)
    return `${diffDays}d remaining`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg min-h-[120px]",
        "active:scale-[0.98] touch-manipulation",
        selected && "ring-2 ring-primary border-primary",
        disabled && "opacity-50 cursor-not-allowed",
        order.priority === "high" && "border-l-4 border-l-red-500",
        order.priority === "medium" && "border-l-4 border-l-amber-500",
        order.priority === "low" && "border-l-4 border-l-green-500",
      )}
      onClick={() => !disabled && onSelect?.(order)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{order.orderNumber}</CardTitle>
            <div className="text-sm text-muted-foreground">{order.productName}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge className={getPriorityColor(order.priority)}>{order.priority.toUpperCase()}</Badge>

            {order.autoAssigned && (
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                <Zap className="mr-1 h-3 w-3" />
                Auto-Assigned
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-semibold">{order.targetQuantity.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-semibold">{formatDuration(order.estimatedDuration)}</span>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Due:</span>
          <span
            className={cn(
              "font-semibold",
              formatDueDate(order.dueDate).includes("Overdue") && "text-red-600",
              formatDueDate(order.dueDate).includes("h remaining") && "text-amber-600",
            )}
          >
            {formatDueDate(order.dueDate)}
          </span>
        </div>

        {/* Auto-assignment confidence */}
        {order.autoAssigned && order.assignmentConfidence && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence:</span>
            <span className="font-semibold text-blue-600">{(order.assignmentConfidence * 100).toFixed(0)}%</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full min-h-[56px] text-lg font-semibold"
          onClick={(e) => {
            e.stopPropagation()
            onStart?.(order)
          }}
          disabled={disabled}
        >
          Start Production
        </Button>
      </CardContent>
    </Card>
  )
}
