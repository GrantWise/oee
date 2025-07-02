import type { ProductionOrder, MachineStatus } from "./mock-data"

export interface SupervisorAlert {
  id: string
  type: "critical" | "warning" | "info"
  priority: "high" | "medium" | "low"
  title: string
  message: string
  machineId: string
  machineName: string
  timestamp: Date
  acknowledged: boolean
  assignedOperator?: string
  estimatedImpact?: {
    unitsLost: number
    costImpact: number
    oeeImpact: number
  }
}

export interface OperatorStatus {
  id: string
  name: string
  status: "active" | "break" | "training" | "absent" | "offline"
  assignedMachine?: string
  lastActivity: Date
  shiftStart: Date
  breaksDue: number
  skillLevel: "trainee" | "operator" | "senior" | "lead"
}

export interface FacilityMetrics {
  overallOEE: number
  totalUnitsProduced: number
  totalUnitsTarget: number
  activeLines: number
  totalLines: number
  criticalAlerts: number
  averageLineSpeed: number
  targetLineSpeed: number
}

// Mock supervisor data
export const mockSupervisorAlerts: SupervisorAlert[] = [
  {
    id: "alert-1",
    type: "critical",
    priority: "high",
    title: "Extended Downtime",
    message: "Line A stopped for 18 minutes - No reason code entered",
    machineId: "line-a",
    machineName: "Line A - Packaging",
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    acknowledged: false,
    assignedOperator: "operator1",
    estimatedImpact: {
      unitsLost: 54,
      costImpact: 2700,
      oeeImpact: 3.2,
    },
  },
  {
    id: "alert-2",
    type: "warning",
    priority: "medium",
    title: "Slow Performance",
    message: "Line B running at 72% of target speed for 45 minutes",
    machineId: "line-b",
    machineName: "Line B - Assembly",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    acknowledged: false,
    assignedOperator: "operator2",
    estimatedImpact: {
      unitsLost: 126,
      costImpact: 1890,
      oeeImpact: 2.1,
    },
  },
  {
    id: "alert-3",
    type: "info",
    priority: "medium",
    title: "Maintenance Request",
    message: "Line C operator requested maintenance for conveyor belt",
    machineId: "line-c",
    machineName: "Line C - Filling",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    acknowledged: false,
    assignedOperator: "operator3",
  },
  {
    id: "alert-4",
    type: "warning",
    priority: "high",
    title: "Target at Risk",
    message: "Line D behind schedule - 15% below daily target",
    machineId: "line-d",
    machineName: "Line D - Labeling",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    acknowledged: true,
    assignedOperator: "operator4",
    estimatedImpact: {
      unitsLost: 450,
      costImpact: 6750,
      oeeImpact: 5.8,
    },
  },
]

export const mockOperatorStatus: OperatorStatus[] = [
  {
    id: "operator1",
    name: "John Smith",
    status: "active",
    assignedMachine: "line-a",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    shiftStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
    breaksDue: 1,
    skillLevel: "senior",
  },
  {
    id: "operator2",
    name: "Sarah Johnson",
    status: "active",
    assignedMachine: "line-b",
    lastActivity: new Date(Date.now() - 1 * 60 * 1000),
    shiftStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
    breaksDue: 0,
    skillLevel: "operator",
  },
  {
    id: "operator3",
    name: "Mike Wilson",
    status: "break",
    assignedMachine: "line-c",
    lastActivity: new Date(Date.now() - 15 * 60 * 1000),
    shiftStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
    breaksDue: 0,
    skillLevel: "lead",
  },
  {
    id: "operator4",
    name: "Lisa Chen",
    status: "active",
    assignedMachine: "line-d",
    lastActivity: new Date(Date.now() - 30 * 1000),
    shiftStart: new Date(Date.now() - 6 * 60 * 60 * 1000),
    breaksDue: 2,
    skillLevel: "operator",
  },
]

// Mock multiple machine statuses
export const mockMultipleMachines: (MachineStatus & { currentOrder?: ProductionOrder })[] = [
  {
    id: "line-a",
    name: "Line A - Packaging",
    status: "stopped",
    lastStateChange: new Date(Date.now() - 18 * 60 * 1000),
    oee: {
      overall: 78.5,
      availability: 82.1,
      performance: 85.2,
      quality: 98.8,
    },
    productionRate: {
      current: 0,
      target: 180,
      unit: "units/hour",
    },
    currentOrder: {
      id: "1",
      orderNumber: "PO-2025-001",
      productName: "Widget A - Premium",
      quantity: 1247,
      targetQuantity: 1500,
      priority: "high",
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      estimatedDuration: 240,
      status: "in_progress",
    },
  },
  {
    id: "line-b",
    name: "Line B - Assembly",
    status: "slow",
    lastStateChange: new Date(Date.now() - 45 * 60 * 1000),
    oee: {
      overall: 72.3,
      availability: 95.2,
      performance: 72.1,
      quality: 99.5,
    },
    productionRate: {
      current: 108,
      target: 150,
      unit: "units/hour",
    },
    currentOrder: {
      id: "2",
      orderNumber: "PO-2025-002",
      productName: "Component B - Standard",
      quantity: 856,
      targetQuantity: 2000,
      priority: "medium",
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
      estimatedDuration: 180,
      status: "in_progress",
    },
  },
  {
    id: "line-c",
    name: "Line C - Filling",
    status: "running",
    lastStateChange: new Date(Date.now() - 2 * 60 * 60 * 1000),
    oee: {
      overall: 89.7,
      availability: 96.8,
      performance: 91.2,
      quality: 98.1,
    },
    productionRate: {
      current: 164,
      target: 180,
      unit: "units/hour",
    },
    currentOrder: {
      id: "3",
      orderNumber: "PO-2025-003",
      productName: "Assembly C - Custom",
      quantity: 328,
      targetQuantity: 500,
      priority: "low",
      dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
      estimatedDuration: 120,
      status: "in_progress",
    },
  },
  {
    id: "line-d",
    name: "Line D - Labeling",
    status: "running",
    lastStateChange: new Date(Date.now() - 1 * 60 * 60 * 1000),
    oee: {
      overall: 85.4,
      availability: 94.1,
      performance: 88.7,
      quality: 99.2,
    },
    productionRate: {
      current: 142,
      target: 160,
      unit: "units/hour",
    },
    currentOrder: {
      id: "4",
      orderNumber: "PO-2025-004",
      productName: "Product D - Special",
      quantity: 1680,
      targetQuantity: 2500,
      priority: "high",
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
      estimatedDuration: 300,
      status: "in_progress",
    },
  },
]

export const mockFacilityMetrics: FacilityMetrics = {
  overallOEE: 81.5,
  totalUnitsProduced: 4111,
  totalUnitsTarget: 6650,
  activeLines: 4,
  totalLines: 4,
  criticalAlerts: 1,
  averageLineSpeed: 103.5,
  targetLineSpeed: 167.5,
}
