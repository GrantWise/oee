"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MachineOverviewCard } from "@/components/supervisor/machine-overview-card"
import { AlertSummaryPanel } from "@/components/supervisor/alert-summary-panel"
import { FacilityMetricsOverview } from "@/components/supervisor/facility-metrics-overview"
import { RefreshCw, Settings, Users, BarChart3, MessageSquare, Bell } from "lucide-react"
import {
  mockSupervisorAlerts,
  mockOperatorStatus,
  mockMultipleMachines,
  mockFacilityMetrics,
  type SupervisorAlert,
} from "@/lib/supervisor-data"
import { useRouter } from "next/navigation"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"
import { AlertAcknowledgmentModal } from "@/components/supervisor/alert-acknowledgment-modal"

export default function SupervisorDashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alerts, setAlerts] = useState(mockSupervisorAlerts)
  const [machines, setMachines] = useState(mockMultipleMachines)
  const [operators] = useState(mockOperatorStatus)
  const [facilityMetrics, setFacilityMetrics] = useState(mockFacilityMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedAlertForAck, setSelectedAlertForAck] = useState<SupervisorAlert | null>(null)
  const [isAckModalOpen, setIsAckModalOpen] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight OEE variations
      setMachines((prev) =>
        prev.map((machine) => ({
          ...machine,
          oee: {
            ...machine.oee,
            overall: Math.max(70, Math.min(95, machine.oee.overall + (Math.random() - 0.5) * 2)),
            performance: Math.max(65, Math.min(95, machine.oee.performance + (Math.random() - 0.5) * 3)),
          },
          productionRate: {
            ...machine.productionRate,
            current:
              machine.status === "running"
                ? Math.max(
                    machine.productionRate.target * 0.7,
                    Math.min(
                      machine.productionRate.target * 1.1,
                      machine.productionRate.current + (Math.random() - 0.5) * 10,
                    ),
                  )
                : machine.status === "slow"
                  ? machine.productionRate.target * 0.72
                  : 0,
          },
        })),
      )

      // Update facility metrics
      setFacilityMetrics((prev) => ({
        ...prev,
        overallOEE: Math.max(75, Math.min(90, prev.overallOEE + (Math.random() - 0.5) * 1)),
        totalUnitsProduced: prev.totalUnitsProduced + Math.floor(Math.random() * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

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

    // Log the classification for demo purposes
    if (classification) {
      console.log("Alert acknowledged with classification:", {
        alertId,
        classification,
      })
    }
  }

  const handleOpenAckModal = (alert: SupervisorAlert) => {
    setSelectedAlertForAck(alert)
    setIsAckModalOpen(true)
  }

  const handleViewAlert = (alert: SupervisorAlert) => {
    console.log("View alert details:", alert)
    // In a real app, this would open alert details modal or navigate to alert page
  }

  const getOperatorForMachine = (machineId: string) => {
    return operators.find((op) => op.assignedMachine === machineId)
  }

  const getMachineAlerts = (machineId: string) => {
    return alerts.filter((alert) => alert.machineId === machineId && !alert.acknowledged).length
  }

  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Production Supervisor Dashboard</h1>
              <Badge variant="outline" className="text-sm">
                Shift 1 - Day Shift
              </Badge>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </div>
            </div>

            <SupervisorNav alertCount={unacknowledgedAlerts.length} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 pb-32 space-y-6">
        {/* Facility Metrics Overview */}
        <FacilityMetricsOverview metrics={facilityMetrics} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Machine Overview Cards - Takes up 3 columns */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Production Lines ({machines.length})</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600">
                  {machines.filter((m) => m.status === "running").length} Running
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  {machines.filter((m) => m.status === "stopped").length} Stopped
                </Badge>
                <Badge variant="outline" className="text-amber-600">
                  {machines.filter((m) => m.status === "slow").length} Slow
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {machines.map((machine) => (
                <MachineOverviewCard
                  key={machine.id}
                  machine={machine}
                  operator={getOperatorForMachine(machine.id)}
                  alerts={getMachineAlerts(machine.id)}
                  onViewDetails={() => router.push(`/supervisor/machine/${machine.id}`)}
                  onContactOperator={() => console.log(`Contact operator for ${machine.name}`)}
                  onViewAlerts={() => console.log(`View alerts for ${machine.name}`)}
                />
              ))}
            </div>
          </div>

          {/* Alert Summary Panel - Takes up 1 column */}
          <div className="xl:col-span-1">
            <AlertSummaryPanel
              alerts={alerts}
              onAcknowledgeAlert={handleOpenAckModal}
              onViewAllAlerts={() => router.push("/supervisor/alerts")}
              onViewAlert={handleViewAlert}
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Quick Actions - ALWAYS VISIBLE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent text-xs"
              onClick={() => console.log("Broadcast message")}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Broadcast</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent text-xs"
              onClick={() => router.push("/supervisor/operators")}
            >
              <Users className="h-5 w-5" />
              <span>Operators</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent text-xs"
              onClick={() => console.log("Production schedule")}
            >
              <Settings className="h-5 w-5" />
              <span>Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent text-xs"
              onClick={() => router.push("/supervisor/reports")}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent text-xs"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent text-xs"
              onClick={() => router.push("/supervisor/alerts")}
            >
              <Bell className="h-5 w-5" />
              <span>Alerts</span>
            </Button>
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
