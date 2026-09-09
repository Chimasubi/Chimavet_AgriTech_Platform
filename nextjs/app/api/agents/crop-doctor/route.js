import { NextResponse } from 'next/server'
import { diagnoseCrop } from '@/lib/agents'

export async function POST(req) {
  try {
    const body = await req.json()
    const { filename = '', fileSize = 0, context = '' } = body
    const result = diagnoseCrop({ filename, fileSize, context })
    return NextResponse.json({ result, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
