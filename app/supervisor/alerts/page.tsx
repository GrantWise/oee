"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"
import { AlertTriangle, Clock, Info, CheckCircle, Search, Eye, MessageSquare } from "lucide-react"
import { useState } from "react"
import { mockSupervisorAlerts, type SupervisorAlert } from "@/lib/supervisor-data"
import { AlertAcknowledgmentModal } from "@/components/supervisor/alert-acknowledgment-modal"

export default function SupervisorAlerts() {
  const [alerts, setAlerts] = useState(mockSupervisorAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<SupervisorAlert | null>(null)
  const [filterType, setFilterType] = useState<"all" | "critical" | "warning" | "info">("all")
  const [selectedAlertForAck, setSelectedAlertForAck] = useState<SupervisorAlert | null>(null)
  const [isAckModalOpen, setIsAckModalOpen] = useState(false)

  const handleAcknowledgeAlert = (alertId: string, classification?: any) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledged: true,
              supervisorClassification: classification,
            }
          : alert,
      ),
    )
  }

  const handleViewAlert = (alert: SupervisorAlert) => {
    setSelectedAlert(alert)
  }

  const handleOpenAckModal = (alert: SupervisorAlert) => {
    setSelectedAlertForAck(alert)
    setIsAckModalOpen(true)
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.machineName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || alert.type === filterType

    return matchesSearch && matchesFilter
  })

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

  const unacknowledgedAlerts = filteredAlerts.filter((alert) => !alert.acknowledged)
  const acknowledgedAlerts = filteredAlerts.filter((alert) => alert.acknowledged)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Alert Management</h1>
              <Badge variant="destructive" className="text-sm">
                {unacknowledgedAlerts.length} Active
              </Badge>
            </div>
            <SupervisorNav alertCount={unacknowledgedAlerts.length} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Alert List */}
          <div className="xl:col-span-2 space-y-6">
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    {(["all", "critical", "warning", "info"] as const).map((type) => (
                      <Button
                        key={type}
                        variant={filterType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType(type)}
                        className={filterType !== type ? "bg-transparent" : ""}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Tabs */}
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active Alerts ({unacknowledgedAlerts.length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({acknowledgedAlerts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {unacknowledgedAlerts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                      <p className="text-muted-foreground">All systems running normally</p>
                    </CardContent>
                  </Card>
                ) : (
                  unacknowledgedAlerts
                    .sort((a, b) => {
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
                          className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${alertColor} ${
                            selectedAlert?.id === alert.id ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => handleViewAlert(alert)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <AlertIcon className="h-5 w-5 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-semibold">{alert.title}</h4>
                                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {formatTimeAgo(alert.timestamp)}
                                  </Badge>
                                  <Badge
                                    variant={
                                      alert.priority === "high"
                                        ? "destructive"
                                        : alert.priority === "medium"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {alert.priority}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{alert.machineName}</span>
                                  {alert.assignedOperator && <span>• {alert.assignedOperator}</span>}
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleViewAlert(alert)
                                    }}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleOpenAckModal(alert)
                                    }}
                                  >
                                    Acknowledge
                                  </Button>
                                </div>
                              </div>

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
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4">
                {acknowledgedAlerts.map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type)

                  return (
                    <Card key={alert.id} className="opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-semibold">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>Resolved</div>
                            <div>{formatTimeAgo(alert.timestamp)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            </Tabs>
          </div>

          {/* Alert Detail Panel */}
          <div className="xl:col-span-1">
            {selectedAlert ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const AlertIcon = getAlertIcon(selectedAlert.type)
                      return <AlertIcon className="h-5 w-5" />
                    })()}
                    Alert Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedAlert.title}</h3>
                    <p className="text-muted-foreground mt-1">{selectedAlert.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Machine</div>
                      <div className="font-medium">{selectedAlert.machineName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Operator</div>
                      <div className="font-medium">{selectedAlert.assignedOperator || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Priority</div>
                      <Badge
                        variant={
                          selectedAlert.priority === "high"
                            ? "destructive"
                            : selectedAlert.priority === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {selectedAlert.priority}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Time</div>
                      <div className="font-medium">{formatTimeAgo(selectedAlert.timestamp)}</div>
                    </div>
                  </div>

                  {selectedAlert.estimatedImpact && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <h4 className="font-semibold text-red-800 mb-2">Estimated Impact</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Units Lost:</span>
                          <span className="font-semibold">{selectedAlert.estimatedImpact.unitsLost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost Impact:</span>
                          <span className="font-semibold">${selectedAlert.estimatedImpact.costImpact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>OEE Impact:</span>
                          <span className="font-semibold">{selectedAlert.estimatedImpact.oeeImpact}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold">Actions</h4>
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Operator
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        View Machine Details
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Escalate to Maintenance
                      </Button>
                      {!selectedAlert.acknowledged && (
                        <Button
                          variant="secondary"
                          className="w-full"
                          size="sm"
                          onClick={() => handleOpenAckModal(selectedAlert)}
                        >
                          Acknowledge Alert
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Alert History</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>Created: {selectedAlert.timestamp.toLocaleString()}</div>
                      <div>Status: {selectedAlert.acknowledged ? "Acknowledged" : "Active"}</div>
                      <div>Duration: {formatTimeAgo(selectedAlert.timestamp)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Select an Alert</h3>
                  <p className="text-muted-foreground text-sm">
                    Click on an alert to view detailed information and available actions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Alert Acknowledgment Modal */}
      <AlertAcknowledgmentModal
        alert={selectedAlertForAck}
        isOpen={isAckModalOpen}
        onClose={() => {
          setIsAckModalOpen(false)
          setSelectedAlertForAck(null)
        }}
        onAcknowledge={handleAcknowledgeAlert}
      />
    </div>
  )
}
