import { headers } from "next/headers"
import { notFound } from "next/navigation"

const ADMIN_PROXY_HEADER = "x-portfolio-admin"

export async function isAdminAuthenticated() {
  if (process.env.NODE_ENV !== "production") {
    return true
  }

  const requestHeaders = await headers()
  return requestHeaders.get(ADMIN_PROXY_HEADER) === "allowed"
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    notFound()
  }
}
