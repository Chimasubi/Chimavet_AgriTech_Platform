import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/data'

export async function GET() {
  return NextResponse.json({ products: PRODUCTS })
}
