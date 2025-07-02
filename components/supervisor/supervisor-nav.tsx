"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, AlertTriangle, BarChart3, Users, Settings, Home, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SupervisorNavProps {
  alertCount?: number
}

export function SupervisorNav({ alertCount = 0 }: SupervisorNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/supervisor/dashboard",
      badge: null,
    },
    {
      label: "Alerts",
      icon: AlertTriangle,
      path: "/supervisor/alerts",
      badge: alertCount > 0 ? alertCount : null,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      path: "/supervisor/analytics",
      badge: null,
    },
    {
      label: "Operators",
      icon: Users,
      path: "/supervisor/operators",
      badge: null,
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/supervisor/settings",
      badge: null,
    },
  ]

  return (
    <div className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.path

        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => router.push(item.path)}
            className={cn("relative", !isActive && "bg-transparent")}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
            {item.badge && (
              <Badge variant="destructive" className="ml-2 text-xs min-w-[20px] h-5 flex items-center justify-center">
                {item.badge}
              </Badge>
            )}
          </Button>
        )
      })}

      <div className="ml-4 border-l pl-4 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/")} className="bg-transparent">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>

        <Button variant="outline" size="sm" onClick={() => router.push("/supervisor/login")} className="bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
