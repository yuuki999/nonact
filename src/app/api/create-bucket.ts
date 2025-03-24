import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// バケット作成関数
async function createBucket() {
  try {
    const { data, error } = await supabase.storage.createBucket('profile', {
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
