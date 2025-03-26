import { supabase } from './supabase';

// ユーザー情報の型定義
export interface UserInfo {
  id: string;
  email: string | null;
  phone_number: string | null;
  display_name: string | null;
}

/**
 * 現在ログインしているユーザーの情報を取得する
 * @returns ユーザー情報のオブジェクト、またはログインしていない場合はnull
 */
export async function getCurrentUserInfo(): Promise<UserInfo | null> {
  try {
    // 現在のセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('ログインしていません');
      return null;
    }
    
    // メールアドレスはセッションから直接取得可能
    const email = session.user.email;
    const id = session.user.id;
    
    // プロフィール情報（電話番号など）を取得
    const { data: profileData, error: profileError } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('プロフィール情報の取得に失敗しました:', profileError);
      return null;
    }
    
    // 取得した情報を返す
    return {
      id,
      email: email ?? null, // emailがundefinedの場合はnullに変換
      phone_number: profileData?.phone_number ?? null,
      display_name: profileData?.display_name ?? null,
    };
  } catch (error) {
    console.error('ユーザー情報の取得中にエラーが発生しました:', error);
    return null;
  }
}
