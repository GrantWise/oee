import { redirect } from "next/navigation"

export default function SupervisorHome() {
  // Redirect to supervisor dashboard by default
  redirect("/supervisor/dashboard")
}
