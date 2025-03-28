import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Database } from '@/app/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

// Resendクライアントの初期化
// APIキーが存在する場合のみ初期化
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// メール送信関数（Resendを使用）
async function sendConfirmationEmail(email: string, name: string, confirmationToken: string) {
  // 確認リンクのURL
  const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/confirm?token=${confirmationToken}`;
  
  try {
    // 開発環境ではコンソールに出力
    console.log(`確認メールを送信: ${email}`);
    console.log(`確認トークン: ${confirmationToken}`);
    console.log(`確認URL: ${confirmationUrl}`);
    
    // Resend APIクライアントが初期化されている場合は実際にメールを送信
    if (resend) {
      try {
        const { error } = await resend.emails.send({
          from: '何もしない人 <onboarding@resend.dev>',
          to: email,
          subject: '何もしない人 - 登録確認',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>登録確認</h2>
              <p>何もしない人への登録ありがとうございます。</p>
              <p>登録を完了するには、以下のボタンをクリックしてください。</p>
              <div style="margin: 30px 0;">
                <a href="${confirmationUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">登録を完了する</a>
              </div>
              <p>ボタンが機能しない場合は、以下のURLをブラウザにコピーしてください：</p>
              <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
              <p>このリンクは24時間有効です。</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
              <p style="color: #6b7280; font-size: 14px;">このメールは自動送信されています。返信はできません。</p>
            </div>
          `,
        });
        
        if (error) {
          console.error('メール送信エラー:', error);
          return false;
        }
      } catch (error) {
        console.error('Resendメール送信例外:', error);
        return false;
      }
      
      console.log('メール送信成功');
      return true;
    }
    
    // 開発環境では常に成功とみなす
    return true;
  } catch (error) {
    console.error('メール送信エラー:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Route Handler内でSupabaseクライアントを初期化 - cookies()をawaitする
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // リクエストボディの取得
    const body = await request.json();
    const { name, email, age, height, hobbies, description, profileImageBase64 } = body;
    
    // バリデーション
    if (!name || !email) {
      return NextResponse.json({ error: '名前とメールアドレスは必須です' }, { status: 400 });
    }
    
    // 既存のユーザーチェック
    const { data: existingUser, error: existingUserError } = await supabase
      .from('nonact_staff_pending')
      .select('id, confirmation_token, expires_at')
      .eq('email', email)
      .single();
    
    // 確認トークンと有効期限の生成
    const confirmationToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24時間後に有効期限切れ
    
    // 既存ユーザーの処理（メール再送）
    if (existingUser && !existingUserError) {
      // 新しいトークンと有効期限で更新
      const { error: updateError } = await supabase
        .from('nonact_staff_pending')
        .update({
          confirmation_token: confirmationToken,
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('既存ユーザー更新エラー:', updateError);
        return NextResponse.json({ error: 'データベースエラーが発生しました' }, { status: 500 });
      }

      // 確認メールを再送
      await sendConfirmationEmail(email, name, confirmationToken);

      return NextResponse.json({
        success: true,
        message: '確認メールを再送しました。メールをご確認ください。',
        resent: true
      });
    }
    
    // 画像処理（Base64からアップロード）
    let imageUrl = null;
    if (profileImageBase64) {
      try {
        // Base64文字列からファイルデータを抽出
        const base64Data = profileImageBase64.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // ファイル名の生成
        const fileName = `${uuidv4()}.jpg`;
        
        // サービスロールを使用してアップロード（RLSをバイパス）
        // 環境変数からサービスロールキーを取得
        const supabaseAdmin = createClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          {
            auth: {
              persistSession: false,
            }
          }
        );
        
        // サービスロールキーの確認用デバッグ出力
        console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('SERVICE_ROLE_KEYが設定されているか:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
        
        // Supabaseストレージにアップロード - バケット名を'trainer'に変更
        const { error: uploadError } = await supabaseAdmin
          .storage
          .from('profile')
          .upload(`staff/${fileName}`, buffer, {
            contentType: 'image/jpeg',
            upsert: false
          });
        
        if (uploadError) {
          console.error('画像アップロードエラー:', uploadError);
          return NextResponse.json({ error: `画像のアップロードに失敗しました: ${JSON.stringify(uploadError)}` }, { status: 500 });
        }
        
        // 画像のURLを取得 - バケット名を'trainer'に変更
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('profile')
          .getPublicUrl(`staff/${fileName}`);
        
        imageUrl = publicUrl;
      } catch (error) {
        console.error('画像処理エラー:', error);
        return NextResponse.json({ error: '画像の処理中にエラーが発生しました' }, { status: 500 });
      }
    }
    
    // nonact_staff_pendingテーブルに仮登録
    const { error: staffError } = await supabase
      .from('nonact_staff_pending')
      .insert([
        {
          name,
          email,
          age: parseInt(age),
          height: parseInt(height),
          hobbies,
          bio: description,
          image_url: imageUrl,
          confirmation_token: confirmationToken,
          expires_at: expiresAt.toISOString()
        }
      ]);
    
    if (staffError) {
      console.error('スタッフ登録エラー:', JSON.stringify(staffError, null, 2));
      return NextResponse.json({ error: `データベースエラーが発生しました: ${staffError.message || staffError.code || 'unknown'}` }, { status: 500 });
    }
    
    // 確認メールの送信
    await sendConfirmationEmail(email, name, confirmationToken);
    
    return NextResponse.json({
      success: true,
      message: '仮登録が完了しました。確認メールを送信しましたので、メール内のリンクをクリックして登録を完了してください。',
      data: { email }
    });
    
  } catch (error) {
    console.error('登録処理エラー:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
