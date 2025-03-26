import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/types/supabase';

// バケット作成関数
async function createBucket() {
  try {
    // Server Component内でSupabaseクライアントを初期化
    const supabase = createServerComponentClient<Database>({ cookies });
    
    const { data, error } = await supabase.storage.createBucket('trainer', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (error) {
      console.error('バケット作成エラー:', error);
    } else {
      console.log('バケット作成成功:', data);
    }
  } catch (error) {
    console.error('予期せぬエラー:', error);
  }
}

// 実行
createBucket();
