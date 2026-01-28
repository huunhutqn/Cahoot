import env from "@cahoot/web/env"
import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    url: env.SOCKET_URL,
  })
}

export const dynamic = "force-dynamic"
