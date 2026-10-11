import { NextRequest, NextResponse } from "next/server"
import { getSSHConnectionStatus } from "@/lib/ssh-achievements"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  let connected = false
  try {
    const values = request.nextUrl.searchParams.getAll("since")
    if (values.length === 1) connected = getSSHConnectionStatus(request.headers, values[0])
  } catch {

  }
  return NextResponse.json({ connected }, { headers: { "Cache-Control": "private, no-store" } })
}
