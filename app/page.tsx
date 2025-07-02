"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Factory, Monitor, Tablet, User, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Factory className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">OEE System</h1>
            <p className="text-xl text-gray-600">Overall Equipment Effectiveness Platform</p>
          </div>
        </div>

        {/* Interface Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Operator Interface */}
          <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Tablet className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Operator Interface</CardTitle>
              <p className="text-muted-foreground">Tablet-optimized production monitoring</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span>Production order selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span>Live production monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span>Downtime reason capture</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span>Touch-optimized controls</span>
                </div>
              </div>

              <Button
                className="w-full min-h-[56px] text-lg font-semibold"
                onClick={() => router.push("/operator/login")}
              >
                Access Operator Console
              </Button>
            </CardContent>
          </Card>

          {/* Supervisor Interface */}
          <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Supervisor Dashboard</CardTitle>
              <p className="text-muted-foreground">Desktop-optimized multi-line oversight</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Multi-machine monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Live OEE analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Alert management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Operator coordination</span>
                </div>
              </div>

              <Button
                className="w-full min-h-[56px] text-lg font-semibold"
                onClick={() => router.push("/supervisor/dashboard")}
              >
                Access Supervisor Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Demo Information */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Demo System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Operator Demo Features:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Real-time production monitoring</li>
                    <li>• 3-level downtime reason codes (700+ options)</li>
                    <li>• Touch-optimized tablet interface</li>
                    <li>• Live production timeline</li>
                    <li>• Action-focused alerts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Supervisor Demo Features:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Multi-line dashboard overview</li>
                    <li>• Real-time OEE analytics</li>
                    <li>• Priority-based alert management</li>
                    <li>• Facility-wide performance metrics</li>
                    <li>• Operator status monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Industrial OEE System • Production Monitoring & Analytics</p>
        </div>
      </div>
    </div>
  )
}
