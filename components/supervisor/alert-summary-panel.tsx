"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Clock, Info, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SupervisorAlert } from "@/lib/supervisor-data"

interface AlertSummaryPanelProps {
  alerts: SupervisorAlert[]
  onAcknowledgeAlert?: (alert: SupervisorAlert) => void // Changed to pass full alert object
  onViewAllAlerts?: () => void
  onViewAlert?: (alert: SupervisorAlert) => void
}

export function AlertSummaryPanel({
  alerts,
  onAcknowledgeAlert,
  onViewAllAlerts,
  onViewAlert,
}: AlertSummaryPanelProps) {
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged)
  const criticalAlerts = unacknowledgedAlerts.filter((alert) => alert.type === "critical")
  const warningAlerts = unacknowledgedAlerts.filter((alert) => alert.type === "warning")

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertTriangle
      case "warning":
        return Clock
      case "info":
        return Info
      default:
        return Info
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Alerts</CardTitle>
          <div className="flex items-center gap-2">
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalAlerts.length} Critical
              </Badge>
            )}
            {warningAlerts.length > 0 && (
              <Badge className="text-xs bg-amber-100 text-amber-800">{warningAlerts.length} Warning</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{warningAlerts.length}</div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{alerts.filter((a) => a.acknowledged).length}</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>

        {/* Alert List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {unacknowledgedAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No active alerts</p>
                <p className="text-sm">All systems running normally</p>
              </div>
            ) : (
              unacknowledgedAlerts
                .sort((a, b) => {
                  // Sort by priority and time
                  const priorityOrder = { high: 3, medium: 2, low: 1 }
                  const aPriority = priorityOrder[a.priority]
                  const bPriority = priorityOrder[b.priority]

                  if (aPriority !== bPriority) return bPriority - aPriority
                  return b.timestamp.getTime() - a.timestamp.getTime()
                })
                .map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type)
                  const alertColor = getAlertColor(alert.type)

                  return (
                    <Card
                      key={alert.id}
                      className={cn("cursor-pointer transition-all hover:shadow-md border-l-4", alertColor)}
                      onClick={() => onViewAlert?.(alert)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <AlertIcon className="h-4 w-4" />
                              <span className="font-semibold text-sm">{alert.title}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {formatTimeAgo(alert.timestamp)}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">{alert.message}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{alert.machineName}</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onAcknowledgeAlert?.(alert) // Pass full alert object instead of just ID
                                }}
                                className="text-xs h-6"
                              >
                                Acknowledge
                              </Button>
                            </div>
                          </div>

                          {/* Impact Summary */}
                          {alert.estimatedImpact && (
                            <div className="grid grid-cols-3 gap-2 text-xs text-center bg-white/50 rounded p-2">
                              <div>
                                <div className="font-semibold">{alert.estimatedImpact.unitsLost}</div>
                                <div className="text-muted-foreground">Units Lost</div>
                              </div>
                              <div>
                                <div className="font-semibold">${alert.estimatedImpact.costImpact}</div>
                                <div className="text-muted-foreground">Cost Impact</div>
                              </div>
                              <div>
                                <div className="font-semibold">{alert.estimatedImpact.oeeImpact}%</div>
                                <div className="text-muted-foreground">OEE Impact</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </div>
        </ScrollArea>

        {/* View All Button */}
        <Button variant="outline" onClick={onViewAllAlerts} className="w-full bg-transparent">
          View All Alerts ({alerts.length})
        </Button>
      </CardContent>
    </Card>
  )
}
