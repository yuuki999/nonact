'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/supabase';

// App Routerのクライアントコンポーネントで使用するSupabaseクライアント
// 自動的にクッキーベースの認証を処理します
export const supabase = createClientComponentClient<Database>();
