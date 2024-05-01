import { NextResponse } from 'next/server';

import { delay } from '@l/utils';

export async function GET() {
  await delay(1000);
  return NextResponse.json({ hello: 'world' });
}
