"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Monitor, Wifi, WifiOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SupervisorLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, accept any credentials
    if (username && password) {
      router.push("/supervisor/dashboard")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.push("/")} className="mb-4 bg-white/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Monitor className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OEE System</h1>
            <p className="text-gray-600">Supervisor Dashboard</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center">
          <Badge variant={isConnected ? "default" : "destructive"} className="text-sm px-3 py-1">
            {isConnected ? (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="mr-2 h-4 w-4" />
                Offline Mode
              </>
            )}
          </Badge>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">Supervisor Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="min-h-[48px] text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[48px] text-base"
                  required
                />
              </div>

              <Button type="submit" className="w-full min-h-[48px] text-base font-semibold" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center text-sm text-blue-800">
              <p className="font-medium mb-2">Demo Credentials</p>
              <p>
                Username: <span className="font-mono">supervisor1</span>
              </p>
              <p>
                Password: <span className="font-mono">demo123</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-green-800 mb-3">Quick Demo Access</p>
              <Button onClick={() => router.push("/supervisor/dashboard")} className="w-full" variant="outline">
                Go Directly to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Production Facility - Main Plant</p>
          <p>Workstation ID: SUP-001</p>
        </div>
      </div>
    </div>
  )
}
