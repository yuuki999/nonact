import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Database } from '@/app/types/supabase';

export async function GET(request: NextRequest) {
  try {
    // Route Handler内でSupabaseクライアントを初期化
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // URLからトークンを取得
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/register/error?message=無効なトークンです', request.url));
    }
    
    // 仮登録データを取得
    const { data: pendingData, error: pendingError } = await supabase
      .from('nonact_staff_pending')
      .select('*')
      .eq('confirmation_token', token)
      .single();
    
    if (pendingError || !pendingData) {
      return NextResponse.redirect(new URL('/register/error?message=無効なトークンまたは期限切れです', request.url));
    }
    
    // 期限切れチェック
    const expiresAt = new Date(pendingData.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      return NextResponse.redirect(new URL('/register/error?message=確認リンクの期限が切れています', request.url));
    }
    
    // nonact_staffテーブルに本登録
    const { name, email, age, hobbies, bio, image_url } = pendingData;
    
    // ニックネームを名前から生成
    const nickname = name.split(' ')[0]; // 姓名から名前部分を取得
    
    const { error: staffError } = await supabase
      .from('nonact_staff')
      .insert([
        {
          name,
          email,
          nickname,
          age,
          gender: '未設定', // デフォルト値
          prefecture: '未設定', // デフォルト値
          bio,
          hobby: hobbies,
          specialty: '何もしないこと', // デフォルト値
          image_url,
          hourly_rate: 3000, // デフォルト値
          is_available: false // 審査完了に有効化
        }
      ]);
    
    if (staffError) {
      console.error('本登録エラー:', staffError);
      return NextResponse.redirect(new URL('/register/error?message=登録処理中にエラーが発生しました', request.url));
    }
    
    // 仮登録データを削除
    await supabase
      .from('nonact_staff_pending')
      .delete()
      .eq('confirmation_token', token);
    
    // 成功ページにリダイレクト
    return NextResponse.redirect(new URL('/register/complete', request.url));
    
  } catch (error) {
    console.error('確認処理エラー:', error);
    return NextResponse.redirect(new URL('/register/error?message=予期せぬエラーが発生しました', request.url));
  }
}