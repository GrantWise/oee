"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductionOrderCard } from "@/components/oee/production-order-card"
import { User, LogOut, RefreshCw, QrCode } from "lucide-react"
import { mockProductionOrders, type ProductionOrder } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function OrderSelection() {
  const [orders, setOrders] = useState(mockProductionOrders)
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleStartProduction = (order: ProductionOrder) => {
    // Update order status and navigate to monitoring
    const updatedOrders = orders.map((o) => (o.id === order.id ? { ...o, status: "in_progress" as const } : o))
    setOrders(updatedOrders)

    // Navigate to production monitoring with order ID
    router.push(`/operator/production?orderId=${order.id}`)
  }

  const handleScanQR = () => {
    // In a real app, this would open camera for QR scanning
    alert("QR Scanner would open here")
  }

  const availableOrders = orders.filter((order) => order.status === "available")
  const sortedOrders = availableOrders.sort((a, b) => {
    // Sort by priority: high > medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Production Orders</h1>
              <Badge variant="outline" className="text-sm">
                Line A - Packaging
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" onClick={handleScanQR} className="min-h-[56px] bg-transparent">
                <QrCode className="mr-2 h-5 w-5" />
                Scan QR
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="min-h-[56px] bg-transparent"
              >
                <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>operator1</span>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/operator/login")}
                className="min-h-[56px]"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {availableOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl">📋</div>
                <h2 className="text-2xl font-semibold">No Orders Available</h2>
                <p className="text-muted-foreground">
                  There are currently no production orders available for this line. Please check with your supervisor or
                  try refreshing.
                </p>
                <Button onClick={handleRefresh} className="min-h-[56px]">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Refresh Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Orders ({availableOrders.length})</h2>
              <div className="text-sm text-muted-foreground">Sorted by priority and due date</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedOrders.map((order) => (
                <ProductionOrderCard
                  key={order.id}
                  order={order}
                  onSelect={setSelectedOrder}
                  onStart={handleStartProduction}
                  selected={selectedOrder?.id === order.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
