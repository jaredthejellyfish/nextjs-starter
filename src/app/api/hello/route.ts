import { delay } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  await delay(1000);
  return NextResponse.json({ hello: 'world' });
}
