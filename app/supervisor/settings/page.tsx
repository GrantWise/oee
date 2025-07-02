"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"
import { Settings, Users, Cog, Database, Bell, Save, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function SupervisorSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    oeeTargets: {
      overall: 85,
      availability: 95,
      performance: 85,
      quality: 98,
    },
    alertThresholds: {
      criticalDowntime: 15,
      slowPerformance: 75,
      qualityIssue: 95,
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      shiftReports: true,
    },
    system: {
      dataRetention: 90,
      updateInterval: 5,
      autoBackup: true,
      maintenanceMode: false,
    },
  })

  const [users] = useState([
    { id: 1, name: "John Smith", role: "Senior Operator", machine: "Line A", active: true },
    { id: 2, name: "Sarah Johnson", role: "Operator", machine: "Line B", active: true },
    { id: 3, name: "Mike Wilson", role: "Lead Operator", machine: "Line C", active: false },
    { id: 4, name: "Lisa Chen", role: "Operator", machine: "Line D", active: true },
    { id: 5, name: "Tom Brown", role: "Supervisor", machine: "All Lines", active: true },
  ])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">System Settings</h1>
              <Badge variant="outline" className="text-sm">
                Configuration
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={isSaving} className="min-h-[40px]">
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <SupervisorNav alertCount={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <Tabs defaultValue="targets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="targets" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              OEE Targets
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alert Settings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="machines" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Machine Config
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* OEE Targets */}
          <TabsContent value="targets">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>OEE Performance Targets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="overall-target">Overall OEE Target (%)</Label>
                    <Input
                      id="overall-target"
                      type="number"
                      value={settings.oeeTargets.overall}
                      onChange={(e) => updateSetting("oeeTargets", "overall", Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability-target">Availability Target (%)</Label>
                    <Input
                      id="availability-target"
                      type="number"
                      value={settings.oeeTargets.availability}
                      onChange={(e) => updateSetting("oeeTargets", "availability", Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performance-target">Performance Target (%)</Label>
                    <Input
                      id="performance-target"
                      type="number"
                      value={settings.oeeTargets.performance}
                      onChange={(e) => updateSetting("oeeTargets", "performance", Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality-target">Quality Target (%)</Label>
                    <Input
                      id="quality-target"
                      type="number"
                      value={settings.oeeTargets.quality}
                      onChange={(e) => updateSetting("oeeTargets", "quality", Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <div className="text-sm text-green-800 mb-2">Excellent Performance</div>
                      <div className="text-2xl font-bold text-green-600">≥{settings.oeeTargets.overall}%</div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                      <div className="text-sm text-amber-800 mb-2">Good Performance</div>
                      <div className="text-2xl font-bold text-amber-600">65% - {settings.oeeTargets.overall - 1}%</div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <div className="text-sm text-red-800 mb-2">Poor Performance</div>
                      <div className="text-2xl font-bold text-red-600">&lt;65%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alert Settings */}
          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Thresholds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="critical-downtime">Critical Downtime Alert (minutes)</Label>
                    <Input
                      id="critical-downtime"
                      type="number"
                      value={settings.alertThresholds.criticalDowntime}
                      onChange={(e) => updateSetting("alertThresholds", "criticalDowntime", Number(e.target.value))}
                      min="1"
                      max="60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slow-performance">Slow Performance Alert (%)</Label>
                    <Input
                      id="slow-performance"
                      type="number"
                      value={settings.alertThresholds.slowPerformance}
                      onChange={(e) => updateSetting("alertThresholds", "slowPerformance", Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality-issue">Quality Issue Alert (%)</Label>
                    <Input
                      id="quality-issue"
                      type="number"
                      value={settings.alertThresholds.qualityIssue}
                      onChange={(e) => updateSetting("alertThresholds", "qualityIssue", Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <Switch
                      id="email-alerts"
                      checked={settings.notifications.emailAlerts}
                      onCheckedChange={(checked) => updateSetting("notifications", "emailAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <Switch
                      id="sms-alerts"
                      checked={settings.notifications.smsAlerts}
                      onCheckedChange={(checked) => updateSetting("notifications", "smsAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="shift-reports">Automated Shift Reports</Label>
                    <Switch
                      id="shift-reports"
                      checked={settings.notifications.shiftReports}
                      onCheckedChange={(checked) => updateSetting("notifications", "shiftReports", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button>Add New User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${user.active ? "bg-green-500" : "bg-gray-400"}`} />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.role} • {user.machine}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Machine Configuration */}
          <TabsContent value="machines">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Machine Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Line A - Packaging", "Line B - Assembly", "Line C - Filling", "Line D - Labeling"].map(
                      (machine) => (
                        <div key={machine} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{machine}</div>
                            <Badge variant="outline">Online</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Target Rate</div>
                              <div className="font-medium">180 units/hr</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Cycle Time</div>
                              <div className="font-medium">20 seconds</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Configure
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">TransLution Integration</div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Auto-assignment and job receipt scanning</div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">ERP Integration</div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Production order synchronization</div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention (days)</Label>
                    <Input
                      id="data-retention"
                      type="number"
                      value={settings.system.dataRetention}
                      onChange={(e) => updateSetting("system", "dataRetention", Number(e.target.value))}
                      min="30"
                      max="365"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-interval">Update Interval (seconds)</Label>
                    <Input
                      id="update-interval"
                      type="number"
                      value={settings.system.updateInterval}
                      onChange={(e) => updateSetting("system", "updateInterval", Number(e.target.value))}
                      min="1"
                      max="60"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Automatic Backup</Label>
                    <Switch
                      id="auto-backup"
                      checked={settings.system.autoBackup}
                      onCheckedChange={(checked) => updateSetting("system", "autoBackup", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch
                      id="maintenance-mode"
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting("system", "maintenanceMode", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div>
                        <div className="font-medium text-green-800">Database</div>
                        <div className="text-sm text-green-600">Connected</div>
                      </div>
                      <Badge variant="default">Online</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div>
                        <div className="font-medium text-green-800">API Services</div>
                        <div className="text-sm text-green-600">All services running</div>
                      </div>
                      <Badge variant="default">Online</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded">
                      <div>
                        <div className="font-medium text-amber-800">Last Backup</div>
                        <div className="text-sm text-amber-600">2 hours ago</div>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      Run System Diagnostics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
