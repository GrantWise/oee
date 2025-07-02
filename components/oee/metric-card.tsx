import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { getOeeStatusClass } from "@/lib/oee-colors"

interface MetricCardProps {
  title: string
  value: number
  unit?: string
  target?: number
  trend?: {
    direction: "up" | "down" | "neutral"
    value: number
    period: string
  }
  status?: "excellent" | "good" | "poor"
  className?: string
  size?: "sm" | "md" | "lg"
}

export function MetricCard({
  title,
  value,
  unit = "%",
  target,
  trend,
  status,
  className,
  size = "md",
}: MetricCardProps) {
  const statusClass = status ? getOeeStatusClass(value) : ""

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  const textSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  }

  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-lg", status && `border-l-4 ${statusClass}`, className)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
      </CardHeader>
      <CardContent className={sizeClasses[size]}>
        <div className="space-y-2">
          <div
            className={cn(
              "font-black tabular-nums",
              textSizes[size],
              status && statusClass.split(" ")[0], // Extract text color class
            )}
          >
            {value.toFixed(1)}
            {unit}
          </div>

          {target && (
            <div className="text-sm text-muted-foreground">
              Target: {target}
              {unit}
            </div>
          )}

          {trend && (
            <div className="flex items-center text-sm">
              {trend.direction === "up" && <TrendingUp className="mr-1 h-4 w-4 text-green-600" />}
              {trend.direction === "down" && <TrendingDown className="mr-1 h-4 w-4 text-red-600" />}
              {trend.direction === "neutral" && <Minus className="mr-1 h-4 w-4 text-gray-600" />}
              <span
                className={cn(
                  trend.direction === "up" && "text-green-600",
                  trend.direction === "down" && "text-red-600",
                  trend.direction === "neutral" && "text-gray-600",
                )}
              >
                {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                {Math.abs(trend.value)}
                {unit} {trend.period}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
