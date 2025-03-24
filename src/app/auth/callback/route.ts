import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  
  // App RouterではcookiesからSupabaseクライアントを初期化
  const supabase = createRouteHandlerClient({ cookies });
  
  if (code) {
    // ユーザーがメール認証リンクをクリックして戻ってきた場合
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 認証完了後、ユーザーを適切なページにリダイレクト
  return NextResponse.redirect(new URL('/auth/confirmed', requestUrl));
}
