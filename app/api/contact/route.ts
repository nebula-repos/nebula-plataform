import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { name, email, company, role, topic, message } = payload ?? {}

    if (!email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.info("[contact]", {
      name,
      email,
      company,
      role,
      topic,
      message,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[contact] failed", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
