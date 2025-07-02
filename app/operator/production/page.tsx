"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, Square, AlertTriangle, User, LogOut, Phone, Wrench, TrendingDown } from "lucide-react"
import { mockProductionOrders } from "@/lib/mock-data"
import { useRouter, useSearchParams } from "next/navigation"

interface ShiftEvent {
  time: Date
  type: "running" | "slow" | "stopped" | "changeover" | "break"
  duration: number // minutes
  reason?: string
}

export default function OperatorProduction() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [currentOrder, setCurrentOrder] = useState(
    mockProductionOrders.find((o) => o.id === orderId) || mockProductionOrders[0],
  )
  const [productionStartTime] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000)) // Started 2 hours ago
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lineSpeed, setLineSpeed] = useState(145)
  const [targetSpeed] = useState(180)
  const [machineStatus, setMachineStatus] = useState<"running" | "stopped" | "slow">("running")
  const [unacknowledgedStops, setUnacknowledgedStops] = useState([
    { time: new Date(Date.now() - 15 * 60 * 1000), duration: 5, acknowledged: false },
  ])

  // Simulate shift timeline (ONLY PAST EVENTS - no future events)
  const [shiftEvents] = useState<ShiftEvent[]>([
    { time: new Date(Date.now() - 8 * 60 * 60 * 1000), type: "running", duration: 90 },
    { time: new Date(Date.now() - 6.5 * 60 * 60 * 1000), type: "break", duration: 15 },
    { time: new Date(Date.now() - 6.25 * 60 * 60 * 1000), type: "running", duration: 120 },
    { time: new Date(Date.now() - 4.25 * 60 * 60 * 1000), type: "changeover", duration: 30 },
    { time: new Date(Date.now() - 3.75 * 60 * 60 * 1000), type: "running", duration: 105 },
    { time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: "slow", duration: 15 },
    { time: new Date(Date.now() - 1.75 * 60 * 60 * 1000), type: "running", duration: 90 },
    { time: new Date(Date.now() - 15 * 60 * 1000), type: "stopped", duration: 5 },
    // Current running period started 10 minutes ago and is ongoing
    { time: new Date(Date.now() - 10 * 60 * 1000), type: "running", duration: 10 },
  ])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate production updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (machineStatus === "running") {
        setCurrentOrder((prev) => ({
          ...prev,
          quantity: Math.min(prev.quantity + Math.floor(Math.random() * 3), prev.targetQuantity),
        }))

        // Simulate line speed variations
        setLineSpeed((prev) => Math.max(120, Math.min(185, prev + (Math.random() - 0.5) * 10)))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [machineStatus])

  const getRunningTime = () => {
    const diffMs = currentTime.getTime() - productionStartTime.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getProductionProgress = () => {
    return (currentOrder.quantity / currentOrder.targetQuantity) * 100
  }

  const getRemainingTime = () => {
    const remaining = currentOrder.targetQuantity - currentOrder.quantity
    const currentRate = lineSpeed // units per hour
    if (currentRate === 0) return "Calculating..."

    const hoursRemaining = remaining / currentRate
    const hours = Math.floor(hoursRemaining)
    const minutes = Math.floor((hoursRemaining % 1) * 60)

    return `${hours}h ${minutes}m`
  }

  const getSpeedPercentage = () => {
    return Math.round((lineSpeed / targetSpeed) * 100)
  }

  const getActionItems = () => {
    const items = []

    // Unacknowledged stops
    unacknowledgedStops.forEach((stop) => {
      if (!stop.acknowledged) {
        items.push({
          type: "critical",
          message: `Stoppage ${Math.floor((currentTime.getTime() - stop.time.getTime()) / (1000 * 60))} min ago - Needs reason code`,
          action: "Add Reason Code",
          onClick: () => router.push("/operator/downtime"),
        })
      }
    })

    // Slow running
    if (lineSpeed < targetSpeed * 0.85) {
      items.push({
        type: "warning",
        message: `Slow rate last 15 min - Check material feed`,
        action: "Check Feed",
        onClick: () => alert("Material feed check procedure would be shown"),
      })
    }

    // Job completion approaching
    if (getProductionProgress() > 90) {
      items.push({
        type: "info",
        message: `Job nearly complete - Prepare for changeover`,
        action: "View Next Job",
        onClick: () => router.push("/operator/orders"),
      })
    }

    return items
  }

  const renderShiftTimeline = () => {
    const shiftStart = new Date(Date.now() - 8 * 60 * 60 * 1000)
    const totalMinutes = 8 * 60

    // Calculate total duration of all past events
    const totalEventDuration = shiftEvents.reduce((sum, event) => sum + event.duration, 0)

    // Add current running time if machine is running
    const currentRunningTime =
      machineStatus === "running"
        ? Math.floor((currentTime.getTime() - shiftEvents[shiftEvents.length - 1].time.getTime()) / (1000 * 60))
        : 0

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>06:00</span>
          <span>08:00</span>
          <span>10:00</span>
          <span>12:00</span>
          <span>14:00</span>
        </div>
        <div className="h-8 bg-gray-200 rounded flex overflow-hidden">
          {shiftEvents.map((event, index) => {
            const widthPercent = (event.duration / totalMinutes) * 100
            const colorClass = {
              running: "bg-green-500",
              slow: "bg-yellow-500",
              stopped: "bg-red-500",
              changeover: "bg-blue-500",
              break: "bg-gray-400",
            }[event.type]

            return (
              <div
                key={index}
                className={`${colorClass} flex items-center justify-center text-xs text-white font-medium`}
                style={{ width: `${widthPercent}%` }}
                title={`${event.type} - ${event.duration}min`}
              >
                {event.duration > 20 && event.type.charAt(0).toUpperCase()}
              </div>
            )
          })}

          {/* Current running period if machine is running */}
          {machineStatus === "running" && currentRunningTime > 0 && (
            <div
              className="bg-green-500 animate-pulse flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${(currentRunningTime / totalMinutes) * 100}%` }}
              title={`Currently running - ${currentRunningTime}min`}
            >
              {currentRunningTime > 20 && "R"}
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <div className="w-1 h-4 bg-black"></div>
          <span className="text-xs text-muted-foreground ml-1">NOW</span>
        </div>
      </div>
    )
  }

  const actionItems = getActionItems()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {" "}
      {/* Add bottom padding for fixed buttons */}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Line A - Packaging</h1>
              <Badge variant={machineStatus === "running" ? "default" : "destructive"} className="text-sm px-3 py-1">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    machineStatus === "running" ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                {machineStatus.toUpperCase()}: {getRunningTime()}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>operator1</span>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/operator/orders")}
                className="min-h-[56px]"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Action Items - TOP PRIORITY */}
        {actionItems.length > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                ACTION NEEDED ({actionItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {actionItems.map((item, index) => (
                <Alert
                  key={index}
                  className={`${
                    item.type === "critical"
                      ? "border-red-200 bg-red-50"
                      : item.type === "warning"
                        ? "border-amber-200 bg-amber-50"
                        : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-base">{item.message}</span>
                    <Button size="sm" onClick={item.onClick} className="min-h-[44px] ml-4">
                      {item.action}
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Current Job Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Job: {currentOrder.productName}</span>
              <Badge variant="outline">{currentOrder.orderNumber}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Progress</div>
                <div className="text-3xl font-bold mb-2">
                  {currentOrder.quantity.toLocaleString()} / {currentOrder.targetQuantity.toLocaleString()} units
                </div>
                <Progress value={getProductionProgress()} className="h-4" />
                <div className="text-sm text-muted-foreground mt-1">{getProductionProgress().toFixed(1)}% complete</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Time Remaining</div>
                <div className="text-3xl font-bold text-blue-600">{getRemainingTime()}</div>
                <div className="text-sm text-muted-foreground">At current rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Speed - CRITICAL OPERATOR INFO */}
        <Card
          className={`border-l-4 ${
            getSpeedPercentage() >= 90
              ? "border-l-green-500 bg-green-50"
              : getSpeedPercentage() >= 80
                ? "border-l-amber-500 bg-amber-50"
                : "border-l-red-500 bg-red-50"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Line Speed</span>
              <div className="flex items-center gap-2">
                {getSpeedPercentage() < 85 && <TrendingDown className="h-5 w-5 text-red-500" />}
                <Badge
                  className={
                    getSpeedPercentage() >= 90
                      ? "bg-green-100 text-green-800"
                      : getSpeedPercentage() >= 80
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {getSpeedPercentage()}% of target
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Current Rate</div>
                <div className="text-4xl font-bold text-blue-600">{Math.round(lineSpeed)}</div>
                <div className="text-sm text-muted-foreground">units/hour</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Target Rate</div>
                <div className="text-4xl font-bold text-gray-600">{targetSpeed}</div>
                <div className="text-sm text-muted-foreground">units/hour</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Gap</div>
                <div className={`text-4xl font-bold ${lineSpeed >= targetSpeed ? "text-green-600" : "text-red-600"}`}>
                  {lineSpeed >= targetSpeed ? "+" : ""}
                  {Math.round(lineSpeed - targetSpeed)}
                </div>
                <div className="text-sm text-muted-foreground">units/hour</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shift Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Shift Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {renderShiftTimeline()}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Running</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Slow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Stopped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Changeover</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Fixed Bottom Action Buttons - ALWAYS VISIBLE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-4">
            <Button
              size="lg"
              variant={machineStatus === "running" ? "outline" : "default"}
              onClick={() => {
                if (machineStatus === "running") {
                  setMachineStatus("stopped")
                  router.push("/operator/downtime")
                } else {
                  setMachineStatus("running")
                }
              }}
              className="min-h-[80px] flex-col gap-2"
            >
              {machineStatus === "running" ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              {machineStatus === "running" ? "PAUSE" : "RESUME"}
            </Button>

            <Button
              size="lg"
              variant="destructive"
              onClick={() => {
                setMachineStatus("stopped")
                router.push("/operator/downtime")
              }}
              className="min-h-[80px] flex-col gap-2"
            >
              <Square className="h-6 w-6" />
              STOP
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => alert("Maintenance request sent")}
              className="min-h-[80px] flex-col gap-2"
            >
              <Wrench className="h-6 w-6" />
              MAINTENANCE
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => alert("Calling supervisor...")}
              className="min-h-[80px] flex-col gap-2"
            >
              <Phone className="h-6 w-6" />
              HELP
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
