// OEE-specific color utilities based on the design system
export const oeeColors = {
  // OEE Performance Levels
  excellent: "hsl(142 76% 36%)", // ≥85% - Green
  good: "hsl(45 93% 47%)", // 65-84% - Amber
  poor: "hsl(0 72% 51%)", // <65% - Red

  // Machine States
  running: "hsl(142 76% 36%)", // Green - Production running
  slow: "hsl(45 93% 47%)", // Amber - Slow cycle
  shortStop: "hsl(25 95% 53%)", // Orange - Brief stop
  longStop: "hsl(0 72% 51%)", // Red - Downtime
  planned: "hsl(215 20% 65%)", // Gray - Planned downtime
  offline: "hsl(215 14% 34%)", // Dark Gray - Offline

  // Auto-assignment colors
  autoAssigned: "hsl(213 94% 68%)",
  assignmentConflict: "hsl(25 95% 53%)",
} as const

export const getOeeStatusColor = (percentage: number) => {
  if (percentage >= 85) return oeeColors.excellent
  if (percentage >= 65) return oeeColors.good
  return oeeColors.poor
}

export const getOeeStatusClass = (percentage: number) => {
  if (percentage >= 85) return "text-green-600 bg-green-50 border-green-200"
  if (percentage >= 65) return "text-amber-600 bg-amber-50 border-amber-200"
  return "text-red-600 bg-red-50 border-red-200"
}
