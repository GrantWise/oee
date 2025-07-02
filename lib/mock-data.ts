// Mock data for the OEE system
export interface ProductionOrder {
  id: string
  orderNumber: string
  productName: string
  quantity: number
  targetQuantity: number
  priority: "high" | "medium" | "low"
  dueDate: Date
  estimatedDuration: number // minutes
  status: "available" | "in_progress" | "completed" | "paused"
  autoAssigned?: boolean
  assignmentConfidence?: number
}

export interface MachineStatus {
  id: string
  name: string
  status: "running" | "stopped" | "slow" | "maintenance" | "offline"
  currentOrder?: ProductionOrder
  lastStateChange: Date
  oee: {
    overall: number
    availability: number
    performance: number
    quality: number
  }
  productionRate: {
    current: number
    target: number
    unit: string
  }
}

// 3-Level Downtime Reason Structure (3x3x3 = 729 possible codes)
export interface DowntimeReasonLevel1 {
  id: string
  name: string
  icon: string
  color: string
}

export interface DowntimeReasonLevel2 {
  id: string
  parentId: string
  name: string
  icon: string
  color: string
}

export interface DowntimeReasonLevel3 {
  id: string
  parentId: string
  name: string
  icon: string
  color: string
  frequency: number
}

// Level 1 Categories (3x3 = 9 categories)
export const downtimeLevel1: DowntimeReasonLevel1[] = [
  { id: "mechanical", name: "Mechanical", icon: "Wrench", color: "red" },
  { id: "electrical", name: "Electrical", icon: "Zap", color: "red" },
  { id: "hydraulic", name: "Hydraulic", icon: "Droplets", color: "red" },
  { id: "material", name: "Material", icon: "Package", color: "orange" },
  { id: "quality", name: "Quality", icon: "CheckCircle", color: "yellow" },
  { id: "tooling", name: "Tooling", icon: "Hammer", color: "orange" },
  { id: "operator", name: "Operator", icon: "User", color: "blue" },
  { id: "planned", name: "Planned", icon: "Calendar", color: "gray" },
  { id: "external", name: "External", icon: "Building", color: "purple" },
]

// Level 2 Subcategories (9 per Level 1 = 81 total)
export const downtimeLevel2: DowntimeReasonLevel2[] = [
  // Mechanical subcategories
  { id: "mech-drive", parentId: "mechanical", name: "Drive System", icon: "Cog", color: "red" },
  { id: "mech-conveyor", parentId: "mechanical", name: "Conveyor", icon: "ArrowRight", color: "red" },
  { id: "mech-pneumatic", parentId: "mechanical", name: "Pneumatic", icon: "Wind", color: "red" },
  { id: "mech-bearing", parentId: "mechanical", name: "Bearings", icon: "Circle", color: "red" },
  { id: "mech-belt", parentId: "mechanical", name: "Belts/Chains", icon: "Link", color: "red" },
  { id: "mech-coupling", parentId: "mechanical", name: "Couplings", icon: "Unlink", color: "red" },
  { id: "mech-gearbox", parentId: "mechanical", name: "Gearbox", icon: "Settings", color: "red" },
  { id: "mech-shaft", parentId: "mechanical", name: "Shafts", icon: "Minus", color: "red" },
  { id: "mech-other", parentId: "mechanical", name: "Other Mech", icon: "MoreHorizontal", color: "red" },

  // Material subcategories
  { id: "mat-shortage", parentId: "material", name: "Shortage", icon: "AlertTriangle", color: "orange" },
  { id: "mat-quality", parentId: "material", name: "Poor Quality", icon: "X", color: "orange" },
  { id: "mat-wrong", parentId: "material", name: "Wrong Material", icon: "RefreshCw", color: "orange" },
  { id: "mat-contaminated", parentId: "material", name: "Contaminated", icon: "AlertCircle", color: "orange" },
  { id: "mat-damaged", parentId: "material", name: "Damaged", icon: "ShieldAlert", color: "orange" },
  { id: "mat-expired", parentId: "material", name: "Expired", icon: "Clock", color: "orange" },
  { id: "mat-handling", parentId: "material", name: "Handling Issue", icon: "Move", color: "orange" },
  { id: "mat-supply", parentId: "material", name: "Supply Chain", icon: "Truck", color: "orange" },
  { id: "mat-other", parentId: "material", name: "Other Material", icon: "MoreHorizontal", color: "orange" },

  // Operator subcategories
  { id: "op-break", parentId: "operator", name: "Break", icon: "Coffee", color: "blue" },
  { id: "op-training", parentId: "operator", name: "Training", icon: "GraduationCap", color: "blue" },
  { id: "op-setup", parentId: "operator", name: "Setup/Changeover", icon: "Settings", color: "blue" },
  { id: "op-absent", parentId: "operator", name: "Operator Absent", icon: "UserX", color: "blue" },
  { id: "op-meeting", parentId: "operator", name: "Meeting", icon: "Users", color: "blue" },
  { id: "op-error", parentId: "operator", name: "Operator Error", icon: "AlertTriangle", color: "blue" },
  { id: "op-safety", parentId: "operator", name: "Safety Issue", icon: "Shield", color: "blue" },
  { id: "op-cleanup", parentId: "operator", name: "Cleanup", icon: "Trash2", color: "blue" },
  { id: "op-other", parentId: "operator", name: "Other Operator", icon: "MoreHorizontal", color: "blue" },
]

// Level 3 Specific Reasons (9 per Level 2 = 729 total)
export const downtimeLevel3: DowntimeReasonLevel3[] = [
  // Mechanical > Drive System
  { id: "mech-drive-motor", parentId: "mech-drive", name: "Motor Failure", icon: "Zap", color: "red", frequency: 15 },
  { id: "mech-drive-vfd", parentId: "mech-drive", name: "VFD Issue", icon: "BarChart", color: "red", frequency: 8 },
  {
    id: "mech-drive-coupling",
    parentId: "mech-drive",
    name: "Coupling Failure",
    icon: "Link",
    color: "red",
    frequency: 12,
  },
  {
    id: "mech-drive-overload",
    parentId: "mech-drive",
    name: "Overload Trip",
    icon: "AlertTriangle",
    color: "red",
    frequency: 20,
  },
  {
    id: "mech-drive-vibration",
    parentId: "mech-drive",
    name: "Excessive Vibration",
    icon: "Activity",
    color: "red",
    frequency: 6,
  },
  {
    id: "mech-drive-noise",
    parentId: "mech-drive",
    name: "Unusual Noise",
    icon: "Volume2",
    color: "red",
    frequency: 4,
  },
  {
    id: "mech-drive-temp",
    parentId: "mech-drive",
    name: "Overheating",
    icon: "Thermometer",
    color: "red",
    frequency: 10,
  },
  { id: "mech-drive-speed", parentId: "mech-drive", name: "Speed Control", icon: "Gauge", color: "red", frequency: 7 },
  {
    id: "mech-drive-other",
    parentId: "mech-drive",
    name: "Other Drive",
    icon: "MoreHorizontal",
    color: "red",
    frequency: 3,
  },

  // Material > Shortage
  {
    id: "mat-shortage-raw",
    parentId: "mat-shortage",
    name: "Raw Material",
    icon: "Package",
    color: "orange",
    frequency: 25,
  },
  {
    id: "mat-shortage-components",
    parentId: "mat-shortage",
    name: "Components",
    icon: "Puzzle",
    color: "orange",
    frequency: 18,
  },
  {
    id: "mat-shortage-consumables",
    parentId: "mat-shortage",
    name: "Consumables",
    icon: "Droplet",
    color: "orange",
    frequency: 12,
  },
  {
    id: "mat-shortage-packaging",
    parentId: "mat-shortage",
    name: "Packaging",
    icon: "Box",
    color: "orange",
    frequency: 15,
  },
  { id: "mat-shortage-labels", parentId: "mat-shortage", name: "Labels", icon: "Tag", color: "orange", frequency: 8 },
  {
    id: "mat-shortage-adhesive",
    parentId: "mat-shortage",
    name: "Adhesive",
    icon: "Droplets",
    color: "orange",
    frequency: 5,
  },
  {
    id: "mat-shortage-fasteners",
    parentId: "mat-shortage",
    name: "Fasteners",
    icon: "Paperclip",
    color: "orange",
    frequency: 7,
  },
  {
    id: "mat-shortage-chemicals",
    parentId: "mat-shortage",
    name: "Chemicals",
    icon: "Flask",
    color: "orange",
    frequency: 4,
  },
  {
    id: "mat-shortage-other",
    parentId: "mat-shortage",
    name: "Other Shortage",
    icon: "MoreHorizontal",
    color: "orange",
    frequency: 2,
  },

  // Operator > Break
  { id: "op-break-lunch", parentId: "op-break", name: "Lunch Break", icon: "Utensils", color: "blue", frequency: 30 },
  { id: "op-break-coffee", parentId: "op-break", name: "Coffee Break", icon: "Coffee", color: "blue", frequency: 25 },
  { id: "op-break-personal", parentId: "op-break", name: "Personal Break", icon: "User", color: "blue", frequency: 20 },
  { id: "op-break-shift", parentId: "op-break", name: "Shift Change", icon: "RotateCcw", color: "blue", frequency: 15 },
  {
    id: "op-break-emergency",
    parentId: "op-break",
    name: "Emergency Break",
    icon: "AlertTriangle",
    color: "blue",
    frequency: 2,
  },
  { id: "op-break-medical", parentId: "op-break", name: "Medical Break", icon: "Heart", color: "blue", frequency: 3 },
  { id: "op-break-safety", parentId: "op-break", name: "Safety Break", icon: "Shield", color: "blue", frequency: 5 },
  { id: "op-break-extended", parentId: "op-break", name: "Extended Break", icon: "Clock", color: "blue", frequency: 8 },
  {
    id: "op-break-other",
    parentId: "op-break",
    name: "Other Break",
    icon: "MoreHorizontal",
    color: "blue",
    frequency: 4,
  },
]

// Mock production orders
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: "1",
    orderNumber: "PO-2025-001",
    productName: "Widget A - Premium",
    quantity: 0,
    targetQuantity: 1500,
    priority: "high",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    estimatedDuration: 240,
    status: "available",
    autoAssigned: true,
    assignmentConfidence: 0.95,
  },
  {
    id: "2",
    orderNumber: "PO-2025-002",
    productName: "Component B - Standard",
    quantity: 0,
    targetQuantity: 2000,
    priority: "medium",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    estimatedDuration: 180,
    status: "available",
  },
  {
    id: "3",
    orderNumber: "PO-2025-003",
    productName: "Assembly C - Custom",
    quantity: 0,
    targetQuantity: 500,
    priority: "low",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    estimatedDuration: 120,
    status: "available",
  },
]

// Mock machine status
export const mockMachineStatus: MachineStatus = {
  id: "line-a",
  name: "Line A - Packaging",
  status: "running",
  lastStateChange: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  oee: {
    overall: 87.5,
    availability: 94.2,
    performance: 78.1,
    quality: 99.2,
  },
  productionRate: {
    current: 145,
    target: 180,
    unit: "units/hour",
  },
}
