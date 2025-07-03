# OEE System Documentation

This document provides a comprehensive overview of the OEE (Overall Equipment Effectiveness) System's frontend application. It covers the application's structure, components, pages, and the required interfaces for backend integration.

## 1. High-Level Overview

The OEE System is a web-based application designed to monitor and improve manufacturing efficiency. It consists of two main user-facing interfaces:

*   **Operator Interface:** A tablet-optimized interface for production line operators to monitor their work, report production data, and manage downtime.
*   **Supervisor Dashboard:** A desktop-optimized dashboard for supervisors to get a real-time overview of the entire production floor, analyze performance, and manage alerts.

### 1.1. Technology Stack

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Custom-built components using shadcn/ui

### 1.2. Project Structure

The project is organized into the following directories:

*   `/app`: Contains the application's pages and routing.
*   `/components`: Contains reusable UI components.
*   `/lib`: Contains mock data and utility functions.
*   `/styles`: Contains global styles.
*   `/public`: Contains static assets.

## 2. Pages and Routing

The application's pages are organized by user role.

### 2.1. Root (`/`)

*   **`page.tsx`**: The main landing page that directs users to either the Operator Interface or the Supervisor Dashboard.

### 2.2. Operator (`/operator`)

*   **`/login`**: The login page for operators.
*   **`/orders`**: A page that displays a list of available production orders.
*   **`/production`**: The main production monitoring page for operators.
*   **`/downtime`**: A page for operators to record downtime reasons.

### 2.3. Supervisor (`/supervisor`)

*   **`/login`**: The login page for supervisors.
*   **`/dashboard`**: The main dashboard for supervisors, providing an overview of the production floor.
*   **`/alerts`**: A page for supervisors to view and manage alerts.
*   **`/analytics`**: A page for supervisors to view detailed analytics and reports.
*   **`/operators`**: A page for supervisors to view the status of all operators.
*   **`/reports`**: A page for supervisors to generate and view reports.
*   **`/settings`**: A page for supervisors to configure the system.

## 3. Components

The application uses a variety of reusable components, which are organized by user role and functionality.

### 3.1. Common Components (`/components/ui`)

This directory contains common UI components that are used throughout the application, such as buttons, cards, and input fields. These components are based on the shadcn/ui library.

### 3.2. OEE Components (`/components/oee`)

This directory contains components that are specific to the OEE application but are shared between the operator and supervisor interfaces.

*   **`production-order-card.tsx`**: A card component that displays information about a production order.
    *   **Props:**
        *   `order`: `ProductionOrder` - The production order to display.
        *   `onSelect`: `(order: ProductionOrder) => void` - A callback function that is called when the card is selected.
        *   `onStart`: `(order: ProductionOrder) => void` - A callback function that is called when the "Start Production" button is clicked.
        *   `selected`: `boolean` - Whether the card is currently selected.
        *   `disabled`: `boolean` - Whether the card is disabled.
*   **`downtime-reason-grid.tsx`**: A grid component that allows operators to select a downtime reason.
    *   **Props:**
        *   `onLevel1Select`: `(reason: DowntimeReasonLevel1) => void` - A callback function that is called when a level 1 reason is selected.
        *   `onLevel2Select`: `(reason: DowntimeReasonLevel2) => void` - A callback function that is called when a level 2 reason is selected.
        *   `onLevel3Select`: `(reason: DowntimeReasonLevel3) => void` - A callback function that is called when a level 3 reason is selected.
        *   `onRecordAndResume`: `() => void` - A callback function that is called when the "Record & Resume" button is clicked.
        *   `selectedLevel1`: `DowntimeReasonLevel1` - The currently selected level 1 reason.
        *   `selectedLevel2`: `DowntimeReasonLevel2` - The currently selected level 2 reason.
        *   `selectedLevel3`: `DowntimeReasonLevel3` - The currently selected level 3 reason.
        *   `onBack`: `() => void` - A callback function that is called when the "Back" button is clicked.
        *   `currentLevel`: `1 | 2 | 3` - The current level of the downtime reason hierarchy.

### 3.3. Supervisor Components (`/components/supervisor`)

This directory contains components that are specific to the supervisor interface.

*   **`machine-overview-card.tsx`**: A card component that displays an overview of a machine's status and performance.
    *   **Props:**
        *   `machine`: `MachineStatus & { currentOrder?: ProductionOrder }` - The machine to display.
        *   `operator`: `{ name: string, status: string, skillLevel: string }` - The operator assigned to the machine.
        *   `alerts`: `number` - The number of active alerts for the machine.
        *   `onViewDetails`: `() => void` - A callback function that is called when the "View Details" button is clicked.
        *   `onContactOperator`: `() => void` - A callback function that is called when the "Contact" button is clicked.
        *   `onViewAlerts`: `() => void` - A callback function that is called when the alerts button is clicked.
*   **`alert-summary-panel.tsx`**: A panel that displays a summary of active alerts.
    *   **Props:**
        *   `alerts`: `SupervisorAlert[]` - The list of alerts to display.
        *   `onAcknowledgeAlert`: `(alert: SupervisorAlert) => void` - A callback function that is called when an alert is acknowledged.
        *   `onViewAllAlerts`: `() => void` - A callback function that is called when the "View All Alerts" button is clicked.
        *   `onViewAlert`: `(alert: SupervisorAlert) => void` - A callback function that is called when an alert is viewed.
*   **`facility-metrics-overview.tsx`**: A component that displays an overview of facility-wide metrics.
    *   **Props:**
        *   `metrics`: `FacilityMetrics` - The facility metrics to display.
*   **`supervisor-nav.tsx`**: The navigation bar for the supervisor interface.
    *   **Props:**
        *   `alertCount`: `number` - The number of active alerts.
*   **`alert-acknowledgment-modal.tsx`**: A modal that allows supervisors to acknowledge alerts.
    *   **Props:**
        *   `alert`: `SupervisorAlert` - The alert to acknowledge.
        *   `isOpen`: `boolean` - Whether the modal is open.
        *   `onClose`: `() => void` - A callback function that is called when the modal is closed.
        *   `onAcknowledge`: `(alertId: string, classification?: { ... }) => void` - A callback function that is called when the alert is acknowledged.

## 4. Backend Integration: API Interface Specification

To connect the frontend to a backend, the following API endpoints and data structures will be required.

### 4.1. Authentication

*   **`POST /api/auth/operator/login`**: Authenticates an operator.
    *   **Request Body:** `{ "username": "...", "password": "..." }`
    *   **Response:** `{ "token": "...", "operator": { ... } }`
*   **`POST /api/auth/supervisor/login`**: Authenticates a supervisor.
    *   **Request Body:** `{ "username": "...", "password": "..." }`
    *   **Response:** `{ "token": "...", "supervisor": { ... } }`

### 4.2. Operator API

*   **`GET /api/operator/orders`**: Retrieves a list of production orders for the authenticated operator's assigned production line.
    *   **Response:** `ProductionOrder[]`
*   **`POST /api/operator/orders/{orderId}/start`**: Starts a production order.
    *   **Response:** `{ "success": true }`
*   **`GET /api/operator/production/{orderId}`**: Retrieves real-time production data for a specific order.
    *   **Response:** `ProductionData`
*   **`POST /api/operator/downtime`**: Records a downtime event.
    *   **Request Body:** `DowntimeEvent`
    *   **Response:** `{ "success": true }`

### 4.3. Supervisor API

*   **`GET /api/supervisor/dashboard`**: Retrieves an overview of the production floor.
    *   **Response:** `DashboardData`
*   **`GET /api/supervisor/machines`**: Retrieves a list of all machines.
    *   **Response:** `Machine[]`
*   **`GET /api/supervisor/machines/{machineId}`**: Retrieves detailed information for a specific machine.
    *   **Response:** `MachineDetails`
*   **`GET /api/supervisor/alerts`**: Retrieves a list of all alerts.
    *   **Response:** `Alert[]`
*   **`POST /api/supervisor/alerts/{alertId}/acknowledge`**: Acknowledges an alert.
    *   **Request Body:** `{ "notes": "..." }`
    *   **Response:** `{ "success": true }`
*   **`GET /api/supervisor/operators`**: Retrieves a list of all operators.
    *   **Response:** `Operator[]`
*   **`GET /api/supervisor/reports`**: Retrieves data for various reports.
    *   **Query Parameters:** `type`, `startDate`, `endDate`
    *   **Response:** `ReportData`

### 4.4. Data Structures

*   **`ProductionOrder`**:
    *   `id`: string
    *   `orderNumber`: string
    *   `productName`: string
    *   `targetQuantity`: number
    *   `status`: "available" | "in_progress" | "completed"
    *   `priority`: "high" | "medium" | "low"
*   **`ProductionData`**:
    *   `order`: `ProductionOrder`
    *   `quantity`: number
    *   `lineSpeed`: number
    *   `targetSpeed`: number
    *   `machineStatus`: "running" | "stopped" | "slow"
    *   `shiftEvents`: `ShiftEvent[]`
*   **`DowntimeEvent`**:
    *   `orderId`: string
    *   `startTime`: Date
    *   `endTime`: Date
    *   `reasonLevel1`: string
    *   `reasonLevel2`: string
    *   `reasonLevel3`: string (optional)
    *   `notes`: string (optional)
*   **`DashboardData`**:
    *   `facilityMetrics`: `FacilityMetrics`
    *   `machines`: `Machine[]`
    *   `alerts`: `Alert[]`
*   **`FacilityMetrics`**:
    *   `overallOEE`: number
    *   `totalUnitsProduced`: number
    *   `totalDowntime`: number
*   **`Machine`**:
    *   `id`: string
    *   `name`: string
    *   `status`: "running" | "stopped" | "slow"
    *   `oee`: { `overall`: number, `availability`: number, `performance`: number, `quality`: number }
    *   `productionRate`: { `current`: number, `target`: number }
*   **`Alert`**:
    *   `id`: string
    *   `machineId`: string
    *   `message`: string
    *   `timestamp`: Date
    *   `acknowledged`: boolean
*   **`Operator`**:
    *   `id`: string
    *   `name`: string
    *   `assignedMachine`: string
    *   `status`: "online" | "offline"

This documentation should serve as a good starting point for understanding the OEE System's frontend and for developing the backend API.