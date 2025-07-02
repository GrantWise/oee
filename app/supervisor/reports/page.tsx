"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"
import { FileText, Download, Calendar, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ShiftReports() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedShift, setSelectedShift] = useState("current")
  const [isGenerating, setIsGenerating] = useState(false)

  const shifts = [
    { id: "current", name: "Current Shift", time: "06:00 - 14:00" },
    { id: "previous", name: "Previous Shift", time: "22:00 - 06:00" },
    { id: "day", name: "Day Shift", time: "06:00 - 14:00" },
    { id: "evening", name: "Evening Shift", time: "14:00 - 22:00" },
    { id: "night", name: "Night Shift", time: "22:00 - 06:00" },
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const shiftSummary = {
    oee: 81.5,
    availability: 94.2,
    performance: 78.1,
    quality: 99.2,
    unitsProduced: 4250,
    unitsTarget: 5200,
    downtimeEvents: 8,
    totalDowntime: 45, // minutes
    alerts: 12,
    criticalAlerts: 2,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Shift Reports</h1>
              <Badge variant="outline" className="text-sm">
                Performance Analysis
              </Badge>
            </div>
            <SupervisorNav alertCount={3} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Report Generation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Shift Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="report-date">Date</Label>
                <Input
                  id="report-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift-select">Shift</Label>
                <select
                  id="shift-select"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name} ({shift.time})
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={handleGenerateReport} disabled={isGenerating} className="min-h-[40px]">
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>

              <Button variant="outline" className="min-h-[40px] bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Shift Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                OVERALL OEE
                <BarChart3 className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{shiftSummary.oee}%</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.3% vs previous shift
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">PRODUCTION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shiftSummary.unitsProduced.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">of {shiftSummary.unitsTarget.toLocaleString()} target</div>
              <div className="text-sm text-amber-600 mt-1">
                {((shiftSummary.unitsProduced / shiftSummary.unitsTarget) * 100).toFixed(0)}% achieved
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">DOWNTIME</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{shiftSummary.totalDowntime}min</div>
              <div className="text-sm text-muted-foreground">{shiftSummary.downtimeEvents} events</div>
              <div className="text-sm text-red-600 mt-1">
                {((shiftSummary.totalDowntime / 480) * 100).toFixed(1)}% of shift
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ALERTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shiftSummary.alerts}</div>
              <div className="text-sm text-muted-foreground">{shiftSummary.criticalAlerts} critical</div>
              <div className="text-sm text-amber-600 mt-1">
                {shiftSummary.alerts - shiftSummary.criticalAlerts} resolved
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Performance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>OEE Component Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <div className="font-medium">Availability</div>
                    <div className="text-sm text-muted-foreground">Uptime vs planned time</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{shiftSummary.availability}%</div>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded">
                  <div>
                    <div className="font-medium">Performance</div>
                    <div className="text-sm text-muted-foreground">Speed vs ideal speed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-600">{shiftSummary.performance}%</div>
                    <Badge variant="secondary">Good</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <div className="font-medium">Quality</div>
                    <div className="text-sm text-muted-foreground">Good units vs total units</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{shiftSummary.quality}%</div>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Issues This Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { issue: "Material shortage on Line B", duration: "18 min", impact: "High", status: "resolved" },
                  { issue: "Slow performance Line A", duration: "12 min", impact: "Medium", status: "ongoing" },
                  { issue: "Quality check delay", duration: "8 min", impact: "Low", status: "resolved" },
                  { issue: "Operator break extension", duration: "5 min", impact: "Low", status: "resolved" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {item.status === "resolved" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{item.issue}</div>
                        <div className="text-xs text-muted-foreground">{item.duration} downtime</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          item.impact === "High" ? "destructive" : item.impact === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {item.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Line-by-Line Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Line Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Line</th>
                    <th className="text-center p-3">OEE</th>
                    <th className="text-center p-3">Availability</th>
                    <th className="text-center p-3">Performance</th>
                    <th className="text-center p-3">Quality</th>
                    <th className="text-center p-3">Units Produced</th>
                    <th className="text-center p-3">Downtime</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Line A - Packaging",
                      oee: 78.5,
                      avail: 82.1,
                      perf: 85.2,
                      qual: 98.8,
                      units: 1247,
                      downtime: 18,
                      status: "Running",
                    },
                    {
                      name: "Line B - Assembly",
                      oee: 72.3,
                      avail: 95.2,
                      perf: 72.1,
                      qual: 99.5,
                      units: 856,
                      downtime: 8,
                      status: "Slow",
                    },
                    {
                      name: "Line C - Filling",
                      oee: 89.7,
                      avail: 96.8,
                      perf: 91.2,
                      qual: 98.1,
                      units: 1328,
                      downtime: 5,
                      status: "Running",
                    },
                    {
                      name: "Line D - Labeling",
                      oee: 85.4,
                      avail: 94.1,
                      perf: 88.7,
                      qual: 99.2,
                      units: 819,
                      downtime: 14,
                      status: "Running",
                    },
                  ].map((line, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{line.name}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold ${line.oee >= 85 ? "text-green-600" : line.oee >= 65 ? "text-amber-600" : "text-red-600"}`}
                        >
                          {line.oee}%
                        </span>
                      </td>
                      <td className="p-3 text-center">{line.avail}%</td>
                      <td className="p-3 text-center">{line.perf}%</td>
                      <td className="p-3 text-center">{line.qual}%</td>
                      <td className="p-3 text-center">{line.units.toLocaleString()}</td>
                      <td className="p-3 text-center">{line.downtime}min</td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            line.status === "Running" ? "default" : line.status === "Slow" ? "secondary" : "destructive"
                          }
                        >
                          {line.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Historical Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "2025-01-02", shift: "Day Shift", oee: 83.2, status: "completed" },
                { date: "2025-01-01", shift: "Evening Shift", oee: 79.8, status: "completed" },
                { date: "2025-01-01", shift: "Day Shift", oee: 85.1, status: "completed" },
                { date: "2024-12-31", shift: "Night Shift", oee: 76.4, status: "completed" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {report.date} - {report.shift}
                      </div>
                      <div className="text-sm text-muted-foreground">OEE: {report.oee}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Completed</Badge>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
