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

    // Optional server-to-server Sheets sync. Credentials never reach the browser.
    // Supabase remains the source of truth even if Sheets is temporarily unavailable.
    const sheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const sheetSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
    let sheetSync: 'disabled' | 'synced' | 'pending' = 'disabled';
    if (!sheetUrl || !sheetSecret) {
      console.warn('[sheets-sync] disabled: missing production configuration');
    }
    if (sheetUrl && sheetSecret) {
      sheetSync = 'pending';
      try {
        const parsedUrl = new URL(sheetUrl);
        if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'script.google.com' ||
            !parsedUrl.pathname.startsWith('/macros/s/')) throw new Error('Invalid Google Apps Script URL');
        const response = await fetch(sheetUrl, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...parsed.data, id, created_at: new Date().toISOString(), secret: sheetSecret }),
          signal: AbortSignal.timeout(10000),
        });
        if (response.ok) {
          const text = await response.text();
          const result = JSON.parse(text) as { ok?: boolean };
          if (result.ok === true) {
            sheetSync = 'synced';
            console.info('[sheets-sync] completed');
          } else {
            console.warn('[sheets-sync] Apps Script returned unsuccessful result');
          }
        } else {
          console.warn('[sheets-sync] Apps Script HTTP status', response.status);
        }
      } catch (err) {
        const name = err instanceof Error ? err.name : 'UnknownError';
        console.error('[sheets-sync] request failed', name);
        // Leave the saved submission in Supabase; never fail the user's submission.
      }
    }
    return NextResponse.json({ ok: true, id, sheet_sync: sheetSync }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: '서버 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
