import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getCurrentEmployee, type EmployeeRole } from "@/lib/auth/session"

export async function requireAuth() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    })

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function requireRole(allowed: readonly EmployeeRole[]) {
  await requireAuth()
  const employee = await getCurrentEmployee()
  if (!employee || !allowed.includes(employee.role)) redirect("/dashboard")
  return employee
}

export async function requireUnAuth() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    })

  if (session) {
    redirect("/dashboard")
  }
}
