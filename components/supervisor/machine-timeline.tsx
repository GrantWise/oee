"use client"

import { useState, useEffect } from "react"

interface TimelineEvent {
  type: "running" | "stopped" | "slow" | "changeover" | "break" | "maintenance"
  duration: number
  startTime: Date
  reason?: string
}

interface MachineTimelineProps {
  machineId: string
  timeRange?: number // hours to show
  height?: "sm" | "md" | "lg"
  showLabels?: boolean
}

export function MachineTimeline({ machineId, timeRange = 4, height = "sm", showLabels = true }: MachineTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    // Generate realistic timeline data based on machine patterns
    const generateTimelineData = () => {
      const events: TimelineEvent[] = []
      const now = new Date()
      const startTime = new Date(now.getTime() - timeRange * 60 * 60 * 1000)

      // Simulate realistic production patterns
      const patterns = {
        "line-a": [
          { type: "running" as const, duration: 90 },
          { type: "break" as const, duration: 15 },
          { type: "running" as const, duration: 75 },
          { type: "stopped" as const, duration: 18, reason: "Material shortage" },
          { type: "running" as const, duration: 45 },
          { type: "changeover" as const, duration: 25 },
          { type: "running" as const, duration: 12 },
        ],
        "line-b": [
          { type: "running" as const, duration: 120 },
          { type: "slow" as const, duration: 45, reason: "Performance issue" },
          { type: "running" as const, duration: 60 },
          { type: "break" as const, duration: 15 },
          { type: "running" as const, duration: 30 },
        ],
        "line-c": [
          { type: "running" as const, duration: 180 },
          { type: "maintenance" as const, duration: 20, reason: "Scheduled PM" },
          { type: "running" as const, duration: 40 },
        ],
        "line-d": [
          { type: "running" as const, duration: 100 },
          { type: "changeover" as const, duration: 30 },
          { type: "running" as const, duration: 80 },
          { type: "stopped" as const, duration: 10, reason: "Quality issue" },
          { type: "running" as const, duration: 20 },
        ],
      }

      const machinePattern = patterns[machineId as keyof typeof patterns] || patterns["line-a"]
      let currentTime = startTime

      machinePattern.forEach((event) => {
        events.push({
          ...event,
          startTime: new Date(currentTime),
        })
        currentTime = new Date(currentTime.getTime() + event.duration * 60 * 1000)
      })

      return events
    }

    setTimelineEvents(generateTimelineData())
  }, [machineId, timeRange])

  const getEventColor = (type: string) => {
    switch (type) {
      case "running":
        return "bg-green-500"
      case "stopped":
        return "bg-red-500"
      case "slow":
        return "bg-yellow-500"
      case "changeover":
        return "bg-blue-500"
      case "break":
        return "bg-gray-400"
      case "maintenance":
        return "bg-purple-500"
      default:
        return "bg-gray-300"
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case "running":
        return "R"
      case "stopped":
        return "S"
      case "slow":
        return "SL"
      case "changeover":
        return "C"
      case "break":
        return "B"
      case "maintenance":
        return "M"
      default:
        return "?"
    }
  }

  const totalMinutes = timeRange * 60
  const heightClasses = {
    sm: "h-3",
    md: "h-4",
    lg: "h-6",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
  }

  return (
    <div className="space-y-1">
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Last {timeRange}h</span>
          <span>Now</span>
        </div>
      )}

      <div className={`${heightClasses[height]} bg-gray-200 rounded flex overflow-hidden`}>
        {timelineEvents.map((event, index) => {
          const widthPercent = (event.duration / totalMinutes) * 100
          const colorClass = getEventColor(event.type)
          const label = getEventLabel(event.type)

          return (
            <div
              key={index}
              className={`${colorClass} flex items-center justify-center ${textSizes[height]} text-white font-medium transition-all hover:opacity-80 cursor-pointer`}
              style={{ width: `${widthPercent}%` }}
              title={`${event.type.charAt(0).toUpperCase() + event.type.slice(1)} - ${event.duration}min${event.reason ? ` (${event.reason})` : ""}`}
            >
              {event.duration > 15 && height !== "sm" && label}
            </div>
          )
        })}
      </div>

      {showLabels && height !== "sm" && (
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span>Running</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <span>Stopped</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            <span>Slow</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span>Changeover</span>
          </div>
        </div>
      )}
    </div>
  )
}
