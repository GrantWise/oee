import { cn } from "@/lib/utils"
import { getOeeStatusColor } from "@/lib/oee-colors"

interface OeeProgressRingProps {
  value: number
  size?: "sm" | "md" | "lg" | "xl"
  showLabel?: boolean
  className?: string
}

export function OeeProgressRing({ value, size = "md", showLabel = true, className }: OeeProgressRingProps) {
  const sizes = {
    sm: { width: 80, height: 80, radius: 32, strokeWidth: 6, fontSize: "text-sm" },
    md: { width: 120, height: 120, radius: 48, strokeWidth: 8, fontSize: "text-lg" },
    lg: { width: 160, height: 160, radius: 64, strokeWidth: 10, fontSize: "text-2xl" },
    xl: { width: 200, height: 200, radius: 80, strokeWidth: 12, fontSize: "text-3xl" },
  }

  const config = sizes[size]
  const circumference = 2 * Math.PI * config.radius
  const strokeDashoffset = circumference - (value / 100) * circumference
  const color = getOeeStatusColor(value)

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={config.width} height={config.height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-gray-200"
        />

        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke={color}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-black tabular-nums", config.fontSize)} style={{ color }}>
            {value.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}
