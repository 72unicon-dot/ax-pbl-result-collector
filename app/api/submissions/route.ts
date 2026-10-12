import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { submissionSchema } from '@/lib/schema';
import { submissionDb } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ ok: false, message: '공개 조회를 지원하지 않습니다.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  try {
    const length = Number(req.headers.get('content-length') || 0);
    if (length > 64000) return NextResponse.json({ ok: false, message: '입력 데이터가 너무 큽니다.' }, { status: 413 });
    const parsed = submissionSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ ok: false, message: '필수 입력을 확인하세요.', errors: parsed.error.flatten() }, { status: 400 });
    const id = randomUUID();
    // All data writes use the public INSERT-only RLS policy; no elevated credentials are used.
    const { error } = await submissionDb().from('ax_pbl_submissions').insert({ id, ...parsed.data, sheet_sync_status: 'pending' });
    if (error) throw new Error('제출 저장에 실패했습니다. 잠시 후 다시 시도하세요.');

    // Google Sheets export is not enabled until an authenticated server-side integration is configured.
    // Do not forward unauthenticated public form payloads to arbitrary webhook URLs.
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: '서버 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
