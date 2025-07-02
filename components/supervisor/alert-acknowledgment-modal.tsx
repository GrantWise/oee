"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DowntimeReasonGrid } from "@/components/oee/downtime-reason-grid"
import { AlertTriangle, Clock, Info, CheckCircle, ArrowLeft } from "lucide-react"
import type { SupervisorAlert } from "@/lib/supervisor-data"
import type { DowntimeReasonLevel1, DowntimeReasonLevel2, DowntimeReasonLevel3 } from "@/lib/mock-data"

interface AlertAcknowledgmentModalProps {
  alert: SupervisorAlert | null
  isOpen: boolean
  onClose: () => void
  onAcknowledge: (
    alertId: string,
    classification?: {
      level1?: DowntimeReasonLevel1
      level2?: DowntimeReasonLevel2
      level3?: DowntimeReasonLevel3
      notes: string
      supervisorOverride: boolean
    },
  ) => void
}

export function AlertAcknowledgmentModal({ alert, isOpen, onClose, onAcknowledge }: AlertAcknowledgmentModalProps) {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1)
  const [selectedLevel1, setSelectedLevel1] = useState<DowntimeReasonLevel1 | null>(null)
  const [selectedLevel2, setSelectedLevel2] = useState<DowntimeReasonLevel2 | null>(null)
  const [selectedLevel3, setSelectedLevel3] = useState<DowntimeReasonLevel3 | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requiresClassification, setRequiresClassification] = useState(false)

  // Reset state when modal opens/closes
  useState(() => {
    if (isOpen && alert) {
      // Determine if this alert requires downtime classification
      const needsClassification =
        alert.type === "critical" &&
        (alert.title.toLowerCase().includes("downtime") ||
          alert.title.toLowerCase().includes("stopped") ||
          alert.message.toLowerCase().includes("stopped"))

      setRequiresClassification(needsClassification)
      setCurrentLevel(1)
      setSelectedLevel1(null)
      setSelectedLevel2(null)
      setSelectedLevel3(null)
      setNotes("")
    }
  })

  const handleLevel1Select = (reason: DowntimeReasonLevel1) => {
    setSelectedLevel1(reason)
    setCurrentLevel(2)
  }

  const handleLevel2Select = (reason: DowntimeReasonLevel2) => {
    setSelectedLevel2(reason)
    setCurrentLevel(3)
  }

  const handleLevel3Select = (reason: DowntimeReasonLevel3) => {
    setSelectedLevel3(reason)
  }

  const handleBack = () => {
    if (currentLevel === 3) {
      setSelectedLevel3(null)
      setCurrentLevel(2)
    } else if (currentLevel === 2) {
      setSelectedLevel2(null)
      setCurrentLevel(1)
    }
  }

  const handleRecordAndAcknowledge = async () => {
    if (!alert || !selectedLevel1 || !selectedLevel2) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onAcknowledge(alert.id, {
      level1: selectedLevel1,
      level2: selectedLevel2,
      level3: selectedLevel3,
      notes,
      supervisorOverride: true,
    })

    setIsSubmitting(false)
    onClose()
  }

  const handleAcknowledgeWithoutClassification = async () => {
    if (!alert) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAcknowledge(alert.id, {
      notes,
      supervisorOverride: true,
    })

    setIsSubmitting(false)
    onClose()
  }

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

  const getSelectedReasonPath = () => {
    let path = ""
    if (selectedLevel1) path += selectedLevel1.name
    if (selectedLevel2) path += ` > ${selectedLevel2.name}`
    if (selectedLevel3) path += ` > ${selectedLevel3.name}`
    return path
  }

  if (!alert) return null

  const AlertIcon = getAlertIcon(alert.type)
  const alertColor = getAlertColor(alert.type)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Acknowledge Alert - Classify Downtime Reason
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Summary - Compact */}
          <div className={`p-4 rounded-lg border-l-4 ${alertColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertIcon className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>
                  <strong>Machine:</strong> {alert.machineName}
                </span>
                <span>
                  <strong>Time:</strong> {formatTimeAgo(alert.timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Only show classification for downtime-related alerts */}
          {requiresClassification ? (
            <div className="space-y-4">
              {/* Selected Reason Path */}
              {selectedLevel1 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-800 mb-1">Selected Classification Path</div>
                      <div className="font-semibold text-blue-900">{getSelectedReasonPath()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">Level</div>
                      <div className="font-semibold text-blue-900">{currentLevel} of 3</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3x3x3 Downtime Classification Grid - EXACTLY like operators use */}
              <DowntimeReasonGrid
                onLevel1Select={handleLevel1Select}
                onLevel2Select={handleLevel2Select}
                onLevel3Select={handleLevel3Select}
                onRecordAndResume={handleRecordAndAcknowledge}
                selectedLevel1={selectedLevel1}
                selectedLevel2={selectedLevel2}
                selectedLevel3={selectedLevel3}
                onBack={handleBack}
                currentLevel={currentLevel}
              />

              {/* Supervisor Notes */}
              <div className="space-y-2">
                <Label htmlFor="supervisor-notes" className="text-base font-medium">
                  Supervisor Notes (Optional)
                </Label>
                <Textarea
                  id="supervisor-notes"
                  placeholder="Add any additional context about the downtime incident, root cause analysis, or corrective actions taken..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] text-base"
                />
              </div>
            </div>
          ) : (
            /* Simple acknowledgment for non-downtime alerts */
            <div className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">Acknowledge Alert</h3>
                <p className="text-muted-foreground">This alert does not require downtime classification.</p>
              </div>

              {/* Simple Notes */}
              <div className="space-y-2">
                <Label htmlFor="simple-notes" className="text-base font-medium">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="simple-notes"
                  placeholder="Add any additional context or follow-up actions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] text-base"
                />
              </div>

              {/* Simple Acknowledge Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleAcknowledgeWithoutClassification}
                  disabled={isSubmitting}
                  className="min-h-[56px] px-8"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Acknowledge Alert
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons - Only show cancel */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            {requiresClassification && (
              <Button
                variant="outline"
                onClick={handleAcknowledgeWithoutClassification}
                disabled={isSubmitting}
                className="bg-transparent"
              >
                Skip Classification & Acknowledge
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
