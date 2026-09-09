import { NextResponse } from 'next/server'

export async function POST(req) {
  const { items, total } = await req.json()
  const orderId = 'CHV-' + Date.now().toString(36).toUpperCase()
  return NextResponse.json({ orderId, total, itemCount: items?.length || 0, status: 'confirmed' })
}
