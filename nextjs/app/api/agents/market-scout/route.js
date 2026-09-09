import { NextResponse } from 'next/server'
import { getMarketPrices, getAdvice, COMMODITIES } from '@/lib/agents'

export async function GET() {
  return NextResponse.json({ prices: getMarketPrices(), commodities: COMMODITIES, updated: new Date().toISOString() })
}

export async function POST(req) {
  const { commodity, quantity = 1 } = await req.json()
  const advice = getAdvice(commodity, Number(quantity))
  if (!advice) return NextResponse.json({ error: 'Unknown commodity' }, { status: 400 })
  return NextResponse.json(advice)
}
