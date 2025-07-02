"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Package,
  User,
  CheckCircle,
  Calendar,
  HelpCircle,
  ArrowLeft,
  Zap,
  Droplets,
  Hammer,
  Building,
  Cog,
  ArrowRight,
  Wind,
  Circle,
  Link,
  Unlink,
  Settings,
  Minus,
  MoreHorizontal,
  AlertTriangle,
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Clock,
  Move,
  Truck,
  Coffee,
  GraduationCap,
  UserX,
  Users,
  Shield,
  Trash2,
  BarChart,
  Activity,
  Volume2,
  Thermometer,
  Gauge,
  Puzzle,
  Droplet,
  Box,
  Tag,
  Paperclip,
  FlaskRoundIcon as Flask,
  Utensils,
  RotateCcw,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  downtimeLevel1,
  downtimeLevel2,
  downtimeLevel3,
  type DowntimeReasonLevel1,
  type DowntimeReasonLevel2,
  type DowntimeReasonLevel3,
} from "@/lib/mock-data"

interface DowntimeReasonGridProps {
  onLevel1Select?: (reason: DowntimeReasonLevel1) => void
  onLevel2Select?: (reason: DowntimeReasonLevel2) => void
  onLevel3Select?: (reason: DowntimeReasonLevel3) => void
  onRecordAndResume?: () => void
  selectedLevel1?: DowntimeReasonLevel1
  selectedLevel2?: DowntimeReasonLevel2
  selectedLevel3?: DowntimeReasonLevel3
  onBack?: () => void
  currentLevel: 1 | 2 | 3
}

const iconMap = {
  Wrench,
  Package,
  User,
  CheckCircle,
  Calendar,
  HelpCircle,
  Zap,
  Droplets,
  Hammer,
  Building,
  Cog,
  ArrowRight,
  Wind,
  Circle,
  Link,
  Unlink,
  Settings,
  Minus,
  MoreHorizontal,
  AlertTriangle,
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Clock,
  Move,
  Truck,
  Coffee,
  GraduationCap,
  UserX,
  Users,
  Shield,
  Trash2,
  BarChart,
  Activity,
  Volume2,
  Thermometer,
  Gauge,
  Puzzle,
  Droplet,
  Box,
  Tag,
  Paperclip,
  Flask,
  Utensils,
  RotateCcw,
  Heart,
}

export function DowntimeReasonGrid({
  onLevel1Select,
  onLevel2Select,
  onLevel3Select,
  onRecordAndResume,
  selectedLevel1,
  selectedLevel2,
  selectedLevel3,
  onBack,
  currentLevel,
}: DowntimeReasonGridProps) {
  const renderLevel1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary">Select Main Category</h3>
      <div className="grid grid-cols-3 gap-4">
        {downtimeLevel1.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || HelpCircle

          return (
            <Card
              key={category.id}
              className="cursor-pointer transition-all hover:shadow-lg active:scale-[0.95] touch-manipulation border-2 hover:border-primary"
              onClick={() => onLevel1Select?.(category)}
            >
              <CardContent className="p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
                    category.color === "red" && "bg-red-100 text-red-600 hover:bg-red-200",
                    category.color === "orange" && "bg-orange-100 text-orange-600 hover:bg-orange-200",
                    category.color === "blue" && "bg-blue-100 text-blue-600 hover:bg-blue-200",
                    category.color === "yellow" && "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
                    category.color === "gray" && "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    category.color === "purple" && "bg-purple-100 text-purple-600 hover:bg-purple-200",
                  )}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-base text-primary">{category.name}</h4>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderLevel2 = () => {
    if (!selectedLevel1) return null

    const level2Options = downtimeLevel2.filter((item) => item.parentId === selectedLevel1.id)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" onClick={onBack} className="min-h-[56px] bg-transparent">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <h3 className="text-xl font-semibold text-primary">{selectedLevel1.name} - Select Subcategory</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {level2Options.map((subcategory) => {
            const IconComponent = iconMap[subcategory.icon as keyof typeof iconMap] || HelpCircle

            return (
              <Card
                key={subcategory.id}
                className="cursor-pointer transition-all hover:shadow-lg active:scale-[0.95] touch-manipulation border-2 hover:border-primary"
                onClick={() => onLevel2Select?.(subcategory)}
              >
                <CardContent className="p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
                      subcategory.color === "red" && "bg-red-100 text-red-600 hover:bg-red-200",
                      subcategory.color === "orange" && "bg-orange-100 text-orange-600 hover:bg-orange-200",
                      subcategory.color === "blue" && "bg-blue-100 text-blue-600 hover:bg-blue-200",
                      subcategory.color === "yellow" && "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
                      subcategory.color === "gray" && "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      subcategory.color === "purple" && "bg-purple-100 text-purple-600 hover:bg-purple-200",
                    )}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-base text-primary">{subcategory.name}</h4>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Record & Resume available at Level 2 */}
        <div className="flex gap-4 pt-4">
          <Button
            size="lg"
            onClick={onRecordAndResume}
            className="flex-1 min-h-[72px] text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            Record & Acknowledge Alert
          </Button>
        </div>
      </div>
    )
  }

  const renderLevel3 = () => {
    if (!selectedLevel1 || !selectedLevel2) return null

    const level3Options = downtimeLevel3.filter((item) => item.parentId === selectedLevel2.id)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" onClick={onBack} className="min-h-[56px] bg-transparent">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <h3 className="text-xl font-semibold text-primary">{selectedLevel2.name} - Select Specific Reason</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {level3Options.map((reason) => {
            const IconComponent = iconMap[reason.icon as keyof typeof iconMap] || HelpCircle

            return (
              <Card
                key={reason.id}
                className="cursor-pointer transition-all hover:shadow-lg active:scale-[0.95] touch-manipulation border-2 hover:border-primary"
                onClick={() => onLevel3Select?.(reason)}
              >
                <CardContent className="p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
                      reason.color === "red" && "bg-red-100 text-red-600 hover:bg-red-200",
                      reason.color === "orange" && "bg-orange-100 text-orange-600 hover:bg-orange-200",
                      reason.color === "blue" && "bg-blue-100 text-blue-600 hover:bg-blue-200",
                      reason.color === "yellow" && "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
                      reason.color === "gray" && "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      reason.color === "purple" && "bg-purple-100 text-purple-600 hover:bg-purple-200",
                    )}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-sm text-primary">{reason.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Used {reason.frequency}x</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Record & Resume also available at Level 3 */}
        <div className="flex gap-4 pt-4">
          <Button
            size="lg"
            onClick={onRecordAndResume}
            className="flex-1 min-h-[72px] text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            Record & Acknowledge Alert
          </Button>
        </div>
      </div>
    )
  }

  switch (currentLevel) {
    case 1:
      return renderLevel1()
    case 2:
      return renderLevel2()
    case 3:
      return renderLevel3()
    default:
      return renderLevel1()
  }
}
