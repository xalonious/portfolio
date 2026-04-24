import { NextRequest, NextResponse } from "next/server"

const ART = `
   |\\---/|
   | ,_, |
    \\_\`_/-..----.
 ___/ \`   ' ,""\+ \\
(__...'   __\\    |\`.___.';
  (_,...'(_,.\`__)/'.....+

  hi. i'm sealy. cto. unbothered.
  you found the curl easter egg.
  most people don't know this exists.

  ↑↑↓↓←→←→BA  (there's more where that came from)

`

export function proxy(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? ""
  if (ua.toLowerCase().includes("curl")) {
    return new NextResponse(ART, {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }
}

export const config = {
  matcher: "/",
}