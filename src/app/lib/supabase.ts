'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// App Routerのクライアントコンポーネントで使用するSupabaseクライアント
// 自動的にクッキーベースの認証を処理します
export const supabase = createClientComponentClient<Database>();

// バックアップとして、従来の方法でもクライアントを作成可能
export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseAnonKey);
};
