"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DowntimeReasonGrid } from "@/components/oee/downtime-reason-grid"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import type { DowntimeReasonLevel1, DowntimeReasonLevel2, DowntimeReasonLevel3 } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function DowntimeCapture() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1)
  const [selectedLevel1, setSelectedLevel1] = useState<DowntimeReasonLevel1 | null>(null)
  const [selectedLevel2, setSelectedLevel2] = useState<DowntimeReasonLevel2 | null>(null)
  const [selectedLevel3, setSelectedLevel3] = useState<DowntimeReasonLevel3 | null>(null)
  const [notes, setNotes] = useState("")
  const [downtimeStart] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update current time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  })

  const getDowntimeDuration = () => {
    const diffMs = currentTime.getTime() - downtimeStart.getTime()
    const minutes = Math.floor(diffMs / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

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

  const handleRecordAndResume = async () => {
    if (!selectedLevel1 || !selectedLevel2) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would submit the downtime data
    console.log({
      level1: selectedLevel1,
      level2: selectedLevel2,
      level3: selectedLevel3, // May be null if stopped at level 2
      notes,
      duration: getDowntimeDuration(),
      startTime: downtimeStart,
      endTime: currentTime,
    })

    setIsSubmitting(false)

    // Navigate back to production monitoring
    router.push("/operator/production")
  }

  const handleBack = () => {
    if (currentLevel === 3) {
      setSelectedLevel3(null)
      setCurrentLevel(2)
    } else if (currentLevel === 2) {
      setSelectedLevel2(null)
      setCurrentLevel(1)
    } else {
      router.back()
    }
  }

  const getSelectedReasonPath = () => {
    let path = ""
    if (selectedLevel1) path += selectedLevel1.name
    if (selectedLevel2) path += ` > ${selectedLevel2.name}`
    if (selectedLevel3) path += ` > ${selectedLevel3.name}`
    return path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="lg" onClick={handleBack} className="min-h-[56px] bg-transparent">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Record Downtime Reason</h1>
              <Badge variant="destructive" className="text-sm">
                PRODUCTION STOPPED
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Downtime Duration</div>
                <div className="text-2xl font-bold text-red-600 tabular-nums">{getDowntimeDuration()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Selected Reason Path */}
        {selectedLevel1 && (
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Selected Path</div>
                  <div className="font-semibold text-lg">{getSelectedReasonPath()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Level</div>
                  <div className="font-semibold">{currentLevel} of 3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reason Selection Grid */}
        <DowntimeReasonGrid
          onLevel1Select={handleLevel1Select}
          onLevel2Select={handleLevel2Select}
          onLevel3Select={handleLevel3Select}
          onRecordAndResume={handleRecordAndResume}
          selectedLevel1={selectedLevel1}
          selectedLevel2={selectedLevel2}
          selectedLevel3={selectedLevel3}
          onBack={handleBack}
          currentLevel={currentLevel}
        />

        {/* Optional Notes - Only show if we have at least Level 2 selected */}
        {selectedLevel2 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional details about the downtime incident..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] text-lg"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                These notes will help with analysis and future prevention
              </div>
            </CardContent>
          </Card>
        )}

        {/* Impact Summary - Only show if we have at least Level 2 selected */}
        {selectedLevel2 && (
          <Card className="mt-6 bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Downtime Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-red-800">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.floor(Number.parseInt(getDowntimeDuration().split(":")[0]) * 2.5)}
                  </div>
                  <div className="text-sm">Units Lost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ${Math.floor(Number.parseInt(getDowntimeDuration().split(":")[0]) * 150)}
                  </div>
                  <div className="text-sm">Estimated Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(Number.parseInt(getDowntimeDuration().split(":")[0]) * 0.1).toFixed(1)}%
                  </div>
                  <div className="text-sm">OEE Impact</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
